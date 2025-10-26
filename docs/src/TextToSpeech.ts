export default async function textToSpeech(text : string): Promise<void> {
    return new Promise((resolve, reject) => {
    // if supported
        if ('speechSynthesis' in window) {
            let speech = new SpeechSynthesisUtterance(text);
            speech.text = text;
            speech.lang = "en-US";
            speech.volume = 1;
            speech.rate = 1.5;
            speech.pitch = 1;
            
            // event listeners
            speech.onstart = function() {
                console.log('tts started');
            };
            
            speech.onend = function() {
                console.log('tts ended');
                resolve();
            };
            
            speech.onerror = function(event) {
                console.error('tts error:', event.error);
                reject(event.error);
            };
            
            window.speechSynthesis.speak(speech);
        } else {
            console.error('tts not supported in browser');
        }
    })
}
