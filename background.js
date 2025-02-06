const API_KEY = "AIzaSyDNc4dV2hcxkpFGmCn1jmIhfq0UaSNpjRw"; // Replace with your API key
const API_URL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`;

// Function to check if a URL is malicious
async function checkURL(url) {
  const requestBody = {
    client: {
      clientId: "SafeLink",
      clientVersion: "1.0",
    },
    threatInfo: {
      threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: [{ url }],
    },
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    return data.matches ? "Malicious" : "Safe";
  } catch (error) {
    console.error("Error checking URL:", error);
    return "Error";
  }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "checkURL") {
    checkURL(request.url).then((result) => sendResponse({ result }));
    return true; // Required for async response
  }
});