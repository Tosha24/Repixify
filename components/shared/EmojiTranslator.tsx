"use client";

import React, { useState } from "react";
import { useToast } from "../ui/use-toast";
import { MdOutlineContentCopy } from "react-icons/md";
import { IoMdDoneAll } from "react-icons/io";
import { CgArrowsExchange } from "react-icons/cg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { GoogleGenerativeAI } from "@google/generative-ai";

const Loader = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
  </div>
);

const EmojiTranslator: React.FC = () => {
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
  const genAI = new GoogleGenerativeAI(API_KEY);

  const [outputText, setOutputText] = useState("" as string);
  const [selectedType, setSelectedType] = useState("" as string);
  const [copied, setCopied] = useState(false);
  const [loader, setLoader] = useState(false);

  const [text, setText] = useState("");

  const { toast } = useToast();

  const placeholders: { [key: string]: string } = {
    texttoemoji: "Enter text to convert to emojis...",
    emojitotext: "Paste emojis to convert to text...",
    addemoji: "Enter text to add emojis to it...",
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Content copied to clipboard",
          duration: 3000,
          className: "success-toast",
        });
      },
      (err) =>
        toast({
          title: "Cannot copy to clipboard",
          description: "Try again",
          duration: 3000,
          className: "error-toast",
        })
    );
  };

  const translate = async (): Promise<void> => {
    let prompt = "";
    if (loader) return;
    setLoader(true);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    if (selectedType === "texttoemoji") {
      prompt = `Convert this text to: ${text}`;
    }
    if (selectedType === "emojitotext") {
      prompt = `Convert this emojis to text: ${text}`;
    }
    if (selectedType === "addemoji") {
      prompt = `Add emojis to this text at every appropiate places: ${text}`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();
    setOutputText(answer);
    setLoader(false);
  };

  return (
    <div className="flex flex-col m-7 p-6 gap-10 bg-slate-800/50 min-h-[90vh]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-lime-200 mb-4 flex items-center justify-center gap-2">
          Emoji <CgArrowsExchange /> Text Generator
        </h1>
        <p className="text-lime-50">
          Convert your text into emojis or vice versa. Add emojis to your text
          using AI.
        </p>
      </div>
      <div className="flex flex-col gap-5 w-[600px] justify-center items-center m-auto mt-0 rounded mb-4">
        <Select onValueChange={setSelectedType}>
          <SelectTrigger className="bg-slate-300 text-black w-full rounded">
            <SelectValue placeholder="Choose translation type" />
          </SelectTrigger>
          <SelectContent className="bg-slate-300">
            <SelectItem
              className="bg-gray-100 cursor-pointer"
              value="texttoemoji"
            >
              Text to Emoji
            </SelectItem>
            <SelectItem
              className="bg-gray-100 cursor-pointer"
              value="emojitotext"
            >
              Emoji to Text
            </SelectItem>
            <SelectItem className="bg-gray-100 cursor-pointer" value="addemoji">
              Add Emoji to Text
            </SelectItem>
          </SelectContent>
        </Select>
        <Textarea
          placeholder={placeholders[selectedType]}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className=" text-white text-wrap h-[100px] font-semibold text-lg"
          disabled={selectedType === "" || loader}
        />

        <button
          onClick={translate}
          disabled={loader || selectedType === "" || text === ""}
          className={`${
            (loader || selectedType === "" || text === "") && "cursor-not-allowed"
          } bg-[#64FFDA] w-full md:w-[300px] hover:bg-[#45dcb9] text-[#0A192F] font-bold py-2 px-4 rounded disabled:bg-[#45dcb9] flex items-center justify-center gap-2`}
        >
          {loader ? <Loader /> : "Translate"}
        </button>
      </div>
      <div
        className={`${
          outputText ? "w-[80vw] md:w-[70vw] flex flex-col mx-auto" : "hidden"
        } mt-0 text-[#CCD6F6] bg-[#112240] p-4 rounded-xl`}
      >
        <h2 className="text-xl font-bold text-[#64FFDA] mb-2">
          Generated Output:
        </h2>
        {outputText.length > 0 && (
          <div className="flex justify-between items-center my-2 p-2 rounded-xl bg-[#133267]">
            <p className="text-[#CCD6F6]">{outputText}</p>
            <button
              className="flex items-center justify-center p-1 rounded"
              onClick={() => {
                copyToClipboard(outputText);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            >
              {copied ? (
                <IoMdDoneAll className="text-[#64FFDA] text-2xl" />
              ) : (
                <MdOutlineContentCopy className="text-[#64FFDA] text-2xl" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmojiTranslator;
