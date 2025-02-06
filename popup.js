document.getElementById("check-btn").addEventListener("click", () => {
    const url = document.getElementById("url-input").value;
    if (!url) {
      alert("Please enter a URL.");
      return;
    }
  
    chrome.runtime.sendMessage({ action: "checkURL", url }, (response) => {
      const resultElement = document.getElementById("result");
      resultElement.textContent = `Result: ${response.result}`;
      resultElement.style.color = response.result === "Malicious" ? "red" : "green";
    });
  });