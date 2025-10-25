const input = document.getElementById("numberInput");
const status = document.getElementById("status");
const saveBtn = document.getElementById("saveBtn");
const readBtn = document.getElementById("readBtn");
const output = document.getElementById("output");

saveBtn.addEventListener("click", () => {
  saveSocialCredit(parseFloat(input.value));
});
readBtn.addEventListener("click", async () => {
  const result = await readSocialCredit();
  console.log(result);
  if (result !== undefined) {
    output.textContent = `Saved number: ${result}`;
  }
});
/**
 * Stores a score to the local storage.
 * @async
 * @function save_score
 * @param {number|string} new_score - The new score to be saved.
 * @returns {Promise<void>}
 */
async function saveSocialCredit(new_score) {
  const value = parseFloat(new_score);
  chrome.storage.local.set({ savedNumber: value }, () => {
    status.textContent = `Saved number: ${value}`;
  });
  get_url();
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
