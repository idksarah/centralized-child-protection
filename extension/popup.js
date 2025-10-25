const input = document.getElementById("numberInput");
const status = document.getElementById("status");
const saveBtn = document.getElementById("saveBtn");
const readBtn = document.getElementById("readBtn");
const output = document.getElementById("output");

saveBtn.addEventListener("click", () => {
  save_score(parseFloat(input.value));
});
readBtn.addEventListener("click", async () => {
  const result = await read_score();
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
async function save_score(new_score) {
  const value = parseFloat(new_score);
  chrome.storage.local.set({ savedNumber: value }, () => {
    status.textContent = `Saved number: ${value}`;
  });
  get_url();
}
/**
 * Reads the saved score value from Chrome's local storage.
 * @async
 * @function read_score
 * @returns {Promise<number|undefined>}
 */
async function read_score() {
  const result = await chrome.storage.local.get(["savedNumber"]);
  if (result.savedNumber !== undefined) {
    return result.savedNumber;
  }
}

// function updateScoreUI() {}