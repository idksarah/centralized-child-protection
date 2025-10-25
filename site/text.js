function textToSpeech(text) {
    // if supported
    if ('speechSynthesis' in window) {
        let speech = new SpeechSynthesisUtterance(text);
        speech.text = text;
        speech.lang = "en-US";
        speech.volume = 1;
        speech.rate = 1;
        speech.pitch = 1;
        
        // event listeners
        speech.onstart = function() {
            console.log('tts started');
        };
        
        speech.onend = function() {
            console.log('tts ended');
        };
        
        speech.onerror = function(event) {
            console.error('tts error:', event.error);
        };
        
        window.speechSynthesis.speak(speech);
    } else {
        console.error('tts not supported in browser');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // delay
    setTimeout(function() {
        textToSpeech("ccp is watching!");
        
        let ttsEnabled = false;
        
        document.addEventListener('click', function() {
            if (!ttsEnabled) {
                ttsEnabled = true;
                textToSpeech("be a goo-oood boy!");
            }
        }, { once: true });
    }, 100);
});