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
    updateScoreUI();
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
    updateScoreUI();
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

function updateScoreUI() {
  // Get the stored value
  read_score().then(value => {
    if (value !== undefined) {
      // Get gauge elements
      const gaugePointer = document.getElementById('gaugePointer');
      const gaugeLabel = document.getElementById('gaugeLabel');
      
      if (gaugePointer && gaugeLabel) {
        // Calculate pointer position [-10 to 10]
        const minValue = -10;
        const maxValue = 10;
        const range = maxValue - minValue;
        const normalizedValue = (value - minValue) / range;
        const pointerAngle = (normalizedValue * 180) - 90; // -90 to 90 degrees
        
        // Update pointer rotation
        gaugePointer.style.transform = `translateX(-50%) rotate(${pointerAngle}deg)`;
        
        // Update label
        gaugeLabel.textContent = `Score: ${value.toFixed(1)} (Range: -10 to 10)`;
      }
    }
  });
}