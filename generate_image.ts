import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: 'A sleek, modern, minimalist 3D app icon for a fitness and martial arts tracker app. Dark mode aesthetic, glowing emerald green accents. A stylized pushup or martial arts silhouette, high quality, centered.',
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        const buffer = Buffer.from(base64EncodeString, 'base64');
        fs.writeFileSync('public/generated_logo.png', buffer);
        console.log("Image saved to public/generated_logo.png");
        return;
      }
    }
    console.log("No image found in response.");
  } catch (e) {
    console.error("Error generating image:", e);
  }
}

run();
