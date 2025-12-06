require('dotenv').config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({}); 

async function main() {
  const prompt = "Me explique o que é IA em menos de 100 palavras.";

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  console.log(response.text);
}

main().catch(console.error);