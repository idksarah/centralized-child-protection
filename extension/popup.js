const input = document.getElementById("numberInput");
const saveBtn = document.getElementById("saveBtn");
saveBtn.addEventListener("click", () => {
  saveSocialCredit(parseFloat(input.value));
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

// All possible phrases based on score ranges
const scorePhrases = {
  // Extremely negative (-100 to -80)
  extremelyNegative: [
    "you are a threat to social harmony",
    "re-education camp recommended",
    "your family is at stake",
    "the party is disappointed in you",
    "your social credit is critically low",
    "you have been reported to the authorities",
    "your behavior is unpatriotic, reflect",
    "you need to study xi jinping thought more",
    "we are about to get a repeat of tiananmen square",
    "you're about to recieve a 'covid' vaccine",
    "jail is imminent"
  ],
  // Very negative (-80 to -50)
  veryNegative: [
    "you are on the border of disappearing",
    "your actions are unacceptable",
    "the party is watching you closely",
    "your behavior is concerning",
    "consider self-reflection and improvement",
    "the party expects better from you",
    "your actions do not serve the people",
    "you need to align with socialist values",
    "you have been flagged for review",
    "your loyalty to the party is questionable",
    "you should read more marxist literature"
  ],
  // Negative (-50 to -20)
  negative: [
    "room for improvement",
    "your contributions could be better",
    "consider serving the community more",
    "the party believes in your potential",
    "work harder for the collective good",
    "you need to be more patriotic",
    "your dedication to socialism is lacking",
    "you should volunteer more for the party"
  ],
  // Slightly negative (-20 to 0)
  slightlyNegative: [
    "keep working towards excellence",
    "the party appreciates your efforts",
    "you're almost a model citizen",
    "the party sees potential in you",
    "stay committed, and the party will reward you",
    "you're getting there, comrade"
  ],
  // Neutral (0)
  neutral: [
    "you are a model citizen",
    "the party is pleased with you",
    "continue your exemplary behavior",
    "you serve the people well",
    "your dedication is noted",
    "you are a good comrade",
    "the party recognizes your service",
    "you embody socialist values well"
  ],
  // Slightly positive (0 to 20)
  slightlyPositive: [
    "you are an outstanding citizen",
    "the party commends your service",
    "you are a role model for others",
    "your contributions are valuable",
    "you embody socialist values",
    "you are a true comrade",
    "the party is proud of your work",
    "you serve the people excellently"
  ],
  // Positive (20 to 50)
  positive: [
    "you are a pillar of the community",
    "the party is proud of you",
    "you are a true patriot",
    "your service to the people is exemplary",
    "you are a model socialist citizen",
    "you are a credit to the party",
    "you embody the spirit of communism",
    "you are a shining example for others"
  ],
  // Very positive (50 to 80)
  veryPositive: [
    "you are a national treasure",
    "the party honors your dedication",
    "you are a hero of the people",
    "your contributions are legendary",
    "you embody the spirit of socialism",
    "you are a living example of communist values",
    "the party celebrates your achievements",
    "you are a true revolutionary"
  ],
  // Extremely positive (80 to 100)
  extremelyPositive: [
    "the party celebrates your greatness",
    "you are the embodiment of perfection",
    "your service transcends all others",
    "you are the ultimate socialist citizen",
    "you are xi jinping's favorite citizen",
    "you are the perfect communist",
    "you are a god among comrades",
    "the party holds you in the highest esteem",
    "you are the pinnacle of socialist values",
    "your legacy will inspire generations of children to come"
  ]
};

function getScorePhrase(score) {
  if (score >= -100 && score < -80) {
    return scorePhrases.extremelyNegative[Math.floor(Math.random() * scorePhrases.extremelyNegative.length)];
  } else if (score >= -80 && score < -50) {
    return scorePhrases.veryNegative[Math.floor(Math.random() * scorePhrases.veryNegative.length)];
  } else if (score >= -50 && score < -20) {
    return scorePhrases.negative[Math.floor(Math.random() * scorePhrases.negative.length)];
  } else if (score >= -20 && score < 0) {
    return scorePhrases.slightlyNegative[Math.floor(Math.random() * scorePhrases.slightlyNegative.length)];
  } else if (score === 0) {
    return scorePhrases.neutral[Math.floor(Math.random() * scorePhrases.neutral.length)];
  } else if (score > 0 && score <= 20) {
    return scorePhrases.slightlyPositive[Math.floor(Math.random() * scorePhrases.slightlyPositive.length)];
  } else if (score > 20 && score <= 50) {
    return scorePhrases.positive[Math.floor(Math.random() * scorePhrases.positive.length)];
  } else if (score > 50 && score <= 80) {
    return scorePhrases.veryPositive[Math.floor(Math.random() * scorePhrases.veryPositive.length)];
  } else if (score > 80 && score <= 100) {
    return scorePhrases.extremelyPositive[Math.floor(Math.random() * scorePhrases.extremelyPositive.length)];
  }
  return "Enter a score to see your status";
}

function updateScoreUI() {
  // Get the stored value
  readSocialCredit().then(value => {
    if (value !== undefined) {
      // Get gauge elements
      const gaugePointer = document.getElementById('gaugePointer');
      const gaugeLabel = document.getElementById('gaugeLabel');
      const scorePhrase = document.getElementById('scorePhrase');
      
      if (gaugePointer && gaugeLabel && scorePhrase) {
        // Calculate pointer position [-100 to 100]
        const minValue = -100;
        const maxValue = 100;
        const range = maxValue - minValue;
        const normalizedValue = (value - minValue) / range;
        const pointerAngle = (normalizedValue * 180) - 90; // -90 to 90 degrees
        
        // Update pointer rotation
        gaugePointer.style.transform = `translateX(-50%) rotate(${pointerAngle}deg)`;
        
        // Update label
        gaugeLabel.textContent = `Score: ${value.toFixed(1)} (Range: -100 to 100)`;
        
        // Update phrase
        scorePhrase.textContent = getScorePhrase(value);
        alert(scorePhrase.textContent);

      }
    }
  });
}