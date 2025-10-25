async function readSocialCredit() {
  const result = await chrome.storage.local.get(["savedNumber"]);
  return result.savedNumber;
}
async function readUrlList() {
  const result = await chrome.storage.local.get({ urlList: [] });
  return result;
}


console.log("injected");
if (document.getElementById("cpp-spyware-div-id-keylogger-malware-install-rm-rf-C://")) {
  found()
}
async function found() {
  chrome.runtime.sendMessage({ isChairmanWebsite:true });
    
    const urlList = await readUrlList();
    
    const socialCredit =  await readSocialCredit();
    
    window.postMessage({
        type: 'SOCIAL_CREDIT_DATA',
        socialCredit: socialCredit,
        urlList: urlList,
      }, '*');  
}