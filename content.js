// Monitor dynamic content changes
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeName === 'A') {
        chrome.runtime.sendMessage({
          action: "checkURL",
          url: node.href
        });
      }
    });
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});