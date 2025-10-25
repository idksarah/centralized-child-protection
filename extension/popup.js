
const input = document.getElementById("numberInput");
const status = document.getElementById("status");
const saveBtn = document.getElementById("saveBtn");
const readBtn = document.getElementById("readBtn")
const output = document.getElementById("output");

saveBtn.addEventListener("click", () => {
  const value = parseFloat(input.value);
  chrome.storage.local.set({ savedNumber: value }, () => {
    status.textContent = `Saved number: ${value}`;
  });
});
readBtn.addEventListener("click", async () => {
  const result = await chrome.storage.local.get(["savedNumber"]);
  if (result.savedNumber !== undefined) {
    output.textContent = `Saved number: ${result.savedNumber}`;
  }
});

async function save_score(new_score) {
  const value = parseFloat(new_score);
  chrome.storage.local.set({ savedNumber:value }, () => {
    status.textContent = `Saved number: ${value}`;
  });
}
