const API_URL = "https://phissy.vercel.app/api/check?url=";

// Function to extract the hostname from a URL
function extractHostname(url) {
  let hostname;
  // Remove protocol and get hostname
  if (url.indexOf("//") > -1) {
    hostname = url.split('/')[2];
  } else {
    hostname = url.split('/')[0];
  }
  // Remove port number and path
  hostname = hostname.split(':')[0];
  hostname = hostname.split('?')[0];
  return hostname;
}

// Function to check if a URL is malicious
async function checkURL(url) {
  try {
    // Add https:// if not present
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    const hostname = extractHostname(url);
    if (!hostname) {
      throw new Error("Invalid URL");
    }

    console.log(`Checking URL: ${hostname}`);
    const response = await fetch(`${API_URL}${encodeURIComponent(hostname)}`);
    console.log("API is going on this: " + `${API_URL}${encodeURIComponent(hostname)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", data); // Log the response data
    return data;
  } catch (error) {
    console.error("Error checking URL:", error.message);
    return { error: error.message };
  }
}

// Listen for messages from the popup script and content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "checkURL") {
    checkURL(message.url).then(result => {
      if (result.is_malicious) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon.png',
          title: 'SafeLink Alert',
          message: 'Warning: The URL you clicked is malicious!'
        });
        chrome.tabs.update(sender.tab.id, {
          url: chrome.runtime.getURL("warning.html") + `?url=${encodeURIComponent(message.url)}`
        });
      }
      if (sendResponse) {
        console.log(result);
        sendResponse(result);
      }
    }).catch(error => {
      console.error("Error in checkURL:", error.message);
      if (sendResponse) {
        sendResponse({ error: error.message });
      }
    });
    return true; // Keep the message channel open for sendResponse
  }
});

// Real-time protection
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (details.frameId === 0) { // Only check main frame
    const result = await checkURL(details.url);
    if (result.is_malicious) {
      chrome.tabs.update(details.tabId, {
        url: chrome.runtime.getURL("warning.html") + `?url=${encodeURIComponent(details.url)}`
      });
    }
  }
});

// Periodic cache cleanup
setInterval(() => urlCache.clear(), 15 * 60 * 1000); // Clear cache every 15 minutes

// Automatically check every tab when it is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    chrome.runtime.sendMessage({ action: "checkURL", url: tab.url });
  }
});