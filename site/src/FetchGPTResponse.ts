export async function fetchGPTResponse(
  prompt: string,
  socialCredit: number,
  urlList: string[],
  keyHistory: string,
  clipboard: string,
) {
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
  console.log(API_KEY);

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant designed to output JSON.",
        },
        {
          role: "user",
          content: `You are Xi Jinping evaluating a citizen's social credit score. Current score: ${socialCredit}/100 (range: -100 to 100).

SURVEILLANCE DATA:
- Recent URLs visited: ${JSON.stringify(urlList)}
- Keyboard activity: ${keyHistory || "None recorded"}
- Clipboard contents: ${clipboard || "Empty"}

TASK:
1. Analyze their behavior using SPECIFIC examples from the data above
2. Be extremely harsh and judgmental based on Xi Jinping's perspective
3. Respond to this prompt: "${prompt}"
4. Calculate a new social credit score based on their actions
5. Keep response under 50 words

OUTPUT FORMAT (strict JSON):
{
  "value": "your harsh comment with specific citations from their data",
  "newSocialCredit": number
}`,
        },
      ],
      response_format: { type: "json_object" },
    }),
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}
