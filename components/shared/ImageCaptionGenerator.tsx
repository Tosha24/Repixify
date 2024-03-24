"use client";

import React from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ImageCaptionGenerator: React.FC = () => {
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
  const genAI = new GoogleGenerativeAI(API_KEY);
  const [outputText, setOutputText] = React.useState("");

  const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result.split(",")[1]);
        } else {
          reject(new Error("Failed to read file as base64 string"));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  };

  const run = async () => {
    console.log("clicked");
    const fileInputEl = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (!fileInputEl.files || fileInputEl.files.length === 0) {
      console.error("No file selected.");
      return;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    const prompt =
      "Generate 3 captions for this image in english within 20 words. Tone: sad.";

    const imageParts = await Promise.all(
      Array.from(fileInputEl.files).map(fileToGenerativePart)
    );

    try {
      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const text = await response.text();
      console.log("response:", text);
      setOutputText(text);
    } catch (error) {
      console.error("Error generating content:", error);
    }
  };

  return (
    <div>
      Image Caption Generator
      <input type="file" accept="image/*" />
      <button
        type="button"
        onClick={run}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Generate Caption
      </button>
      <textarea
        className={`${outputText ? "" : "hidden"} w-full h-64 text-black`}
        placeholder="Generated caption will appear here"
        value={outputText}
      ></textarea>
    </div>
  );
};

export default ImageCaptionGenerator;
