# Cybersecurity Hackathon – Chrome Extension

A lightweight Chrome extension designed to enhance user security by detecting and warning against potential phishing websites.

---

## 🔐 Features

- **Real-Time Phishing Detection:** Monitors active tabs and identifies suspicious URLs.
- **User Alerts:** Displays warning pop-ups when a potential threat is detected.
- **Seamless Integration:** Runs silently in the background without disrupting the browsing experience.
- **Customizable UI:** Includes a popup interface for user interactions and settings.

---

## 🛠️ Technologies Used

- **JavaScript:** Core scripting language for extension functionality.
- **HTML & CSS:** Structure and styling of the popup interface.
- **Chrome Extension APIs:** Utilized for tab monitoring and background processes. ([GitHub - l3montree-dev/csb-hackathon-web: Website for the Cybersecurity Hackathon](https://github.com/l3montree-dev/csb-hackathon-web?utm_source=chatgpt.com), [Build software better, together](https://github.com/topics/threat-detection?utm_source=chatgpt.com))

---

## 📁 Project Structure

```

cybersecurity-hackathon/
├── background.js       # Handles background processes and tab monitoring
├── content.js          # Injected scripts for page-level operations
├── manifest.json       # Extension metadata and permissions
├── popup.html          # HTML structure for the extension's popup
├── popup.js            # Logic for popup interactions
├── style.css           # Styling for the popup interface
├── warning.html        # Warning page displayed upon threat detection
└── icons/              # Extension icons and images
```


---

## 🚀 Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/aerinpatel/cybersecurity-hackathon.git
   ```


2. **Load Extension in Chrome:**

   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable "Developer mode" (toggle in the top right corner).
   - Click on "Load unpacked" and select the cloned `cybersecurity-hackathon` directory.

3. **Test the Extension:**

   - The extension icon should appear in the Chrome toolbar.
   - Click on the icon to access the popup interface.
   - Navigate to various websites to see the extension in action. ([GitHub supply chain attack spills secrets from 23K projects • The Register](https://www.theregister.com/2025/03/17/supply_chain_attack_github/?utm_source=chatgpt.com))

---

## 🧪 Usage

- **Monitoring:** The extension continuously monitors active tabs for potential phishing threats.
- **Alerts:** Upon detecting a suspicious URL, a warning page (`warning.html`) is displayed to alert the user.
- **User Interaction:** Users can interact with the extension via the popup interface to view status or adjust settings.

---

## 🙌 Acknowledgments

This project was developed as part of a cybersecurity hackathon initiative to promote safer browsing experiences.

--
