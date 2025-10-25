const MAX_URLS = 10;

/**
* Adds a url to the url history. Makes a list size max of MAX_URLS 
* @async
* @function saveUrl
* @param {string} url - The new url to be appended.
* @returns {Promise<void>}
*/
export async function saveUrl(url) {
  const result = await chrome.storage.local.get({ urlList: [] });
  const urlList = result.urlList;
  urlList.push(url);
  if (urlList.length > MAX_URLS) {
    urlList.shift();
  }
  await chrome.storage.local.set({ urlList });
  console.log("Saved URL:", url, "| Total URLs stored:", urlList.length);
  const list = await readUrlList();
  console.log("Saved URLs: ", list)
}
/**
* Gives the stored url list
* @async
* @function readUrl
* @returns {Promise<string[]>}
*/
export async function readUrlList() {
  const result = await chrome.storage.local.get({ urlList: [] });
  return result;
}
/**
* Stores a score to the local storage.
* @async
* @function save_score
* @param {number|string} new_score - The new score to be saved.
* @returns {Promise<void>}
*/
export async function saveSocialCredit(new_score) {
  const value = parseFloat(new_score);
  chrome.storage.local.set({ savedNumber: value }, () => {
    status.textContent = `Saved number: ${value}`;
  });
}
/**
* Reads the saved score value from Chrome's local storage.
* @async
* @function readSocialCredit
* @returns {Promise<number|undefined>}
*/
export async function readSocialCredit() {
  const result = await chrome.storage.local.get(["savedNumber"]);
  if (result.savedNumber !== undefined) {
    return result.savedNumber;
  }
}