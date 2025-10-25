import { saveUrl, readUrlList, saveSocialCredit, readSocialCredit} from './data.js';

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  saveUrl(tab.url)
  console.log("Active tab URL (switched):", tab.url);
});

// Fired when a tab updates (URL changes or reloads)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    saveUrl(changeInfo.url)
    console.log("Tab URL updated:", changeInfo.url);
  }
});



// Checks for the chairman website
chrome.runtime.onMessage.addListener(async (msg, sender, response) => {
  if (msg.isChairmanWebsite) {
    const socialCredit = await readSocialCredit();
    const urlList = await readUrlList();
    
    chrome.tabs.sendMessage(tabId, {
      socialCredit,
      urlList,
    });
    console.log("FOUND CHAIRMAN YAYAYA background.js btw")
  }
});

