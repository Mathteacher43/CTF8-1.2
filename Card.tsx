import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeText(text: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Analyze the following text or claim for its truthfulness and logic.
Text: "${text}"

Provide a strict, professional fact-check. Look for clickbait terms, logical fallacies, and factual accuracy.
Respond entirely in Korean.
Return the result strictly as a JSON object matching the requested schema.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: {
            type: Type.INTEGER,
            description: "A trust score from 0 to 100, where 100 is completely verified and trusted."
          },
          status: {
            type: Type.STRING,
            description: "One of: 사실, 의심, 거짓, 판단불가"
          },
          reasons: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of reasons for the verdict in Korean."
          }
        },
        required: ["score", "status", "reasons"]
      }
    }
  });

  const rawJson = response.text || "{}";
  
  // Also get the search grounding links if useful
  const sources: any[] = [];
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (chunks) {
    chunks.forEach((c: any) => {
      if (c.web?.uri) {
        sources.push({ title: c.web.title, url: c.web.uri });
      }
    });
  }

  try {
    const data = JSON.parse(rawJson.trim());
    return { ...data, sources };
  } catch (e) {
    console.error("JSON parse error:", e);
    return { score: 0, status: "Error", reasons: ["Failed to parse AI response"], sources: [] };
  }
}

export async function analyzeImage(base64Data: string, mimeType: string, exifInfo: any) {
  const exifContext = exifInfo ? `Image EXIF Data: ${JSON.stringify(exifInfo)}` : 'No EXIF data found.';
  
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/png", // We will convert image to standard format or use original
            data: base64Data
          }
        },
        {
          text: `Analyze this image for signs of manipulation, AI generation, or false context. \n${exifContext}\n\nRespond entirely in Korean.\nReturn the result strictly as a JSON object matching the requested schema.`
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: {
            type: Type.INTEGER,
            description: "A trust score from 0 to 100. AI-generated gives a very low score."
          },
          status: {
            type: Type.STRING,
            description: "One of: 원본, 조작됨, AI생성, 의심"
          },
          reasons: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Visual inconsistencies, EXIF discrepancies, or signs of AI generation in Korean."
          }
        },
        required: ["score", "status", "reasons"]
      }
    }
  });

  const rawJson = response.text || "{}";
  try {
    return JSON.parse(rawJson.trim());
  } catch (e) {
    console.error("JSON parse error:", e);
    return { score: 0, status: "Error", reasons: ["Failed to parse AI response"] };
  }
}
