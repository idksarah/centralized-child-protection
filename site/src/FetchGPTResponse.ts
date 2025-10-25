export async function fetchGPTResponse(prompt: string, socialCredit:number, urlList:string[], keyHistory:string, clipboard:string) {
  
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
  console.log(API_KEY)
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant designed to output JSON."
        },
        {
          role: "user",
          content: `Pretend that you are Xi Jinping and you are grading people based off of their social credit score. This person's credit score is ${socialCredit}, and social credit can range from -100 to 100. Treat the person accordingly. Also, here is the past 10 urls this person visited: ${urlList}\nPlease take this information and generate a response
          based on this prompt: ${prompt}.
          Use a minimal prompt.
          The response must be JSON in the format:
          {
            value: string
          }`
        }
      ],
      response_format: { type: "json_object" }
    }),
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}
