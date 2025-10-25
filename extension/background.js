const MAX_URLS = 10;
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
  const list = await readUrl();
  console.log("Saved URLs: ", list)
}
/**
 * Gives the stored url list
 * @async
 * @function readUrl
 * @returns {Promise<string[]>}
 */
async function readUrl() {
  const result = await chrome.storage.local.get({ urlList: [] });
  return result;
}