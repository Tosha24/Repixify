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

const Loader = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
  </div>
);

const EmojiTranslator: React.FC = () => {
  const [outputText, setOutputText] = useState("" as string);
  const [selectedType, setSelectedType] = useState("" as string);
  const [copySuccessIndex, setCopySuccessIndex] = useState(-1);
  const [loader, setLoader] = useState(false);
  const { toast } = useToast();

  const placeholders: { [key: string]: string } = {
    texttoemoji: "Enter text to convert to emojis...",
    emojitotext: "Paste emojis to convert to text...",
    addemoji: "Enter text to add emojis to it...",
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopySuccessIndex(index);
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
    if (loader) return;
    setLoader(true);

    // Example functionality - adapt according to your API or logic
    setTimeout(() => {
      setOutputText("Examples of text based on " + selectedType);
      setLoader(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col m-7 p-6 gap-10 bg-slate-800/50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-lime-200 mb-4 flex items-center justify-center gap-2">
          Emoji <CgArrowsExchange /> Text Generator
        </h1>
        <p className="text-lime-50">
          Convert your text into emojis or vice versa. Add emojis to your text
          using AI.
        </p>
      </div>
      <div className="flex flex-col gap-5 items-center">
        <Select onValueChange={setSelectedType}>
          <SelectTrigger className="bg-slate-300 text-black w-full">
            <SelectValue placeholder="Choose translation type" />
          </SelectTrigger>
          <SelectContent className="bg-slate-300">
            {/* SelectItem components unchanged */}
          </SelectContent>
        </Select>
        <Textarea
          placeholder={
            placeholders[selectedType] || "Choose a translation type..."
          }
          className="w-full"
        />
        <button
          onClick={translate}
          disabled={loader}
          className="bg-[#64FFDA] w-full md:w-[300px] hover:bg-[#45dcb9] text-[#0A192F] font-bold py-2 px-4 rounded disabled:bg-[#45dcb9] flex items-center justify-center gap-2"
        >
          {loader ? <Loader /> : "Translate"}
        </button>
      </div>
      {outputText.length > 0 && (
        <div className="text-[#CCD6F6] bg-[#112240] p-4 rounded-xl w-full max-w-[800px] mx-auto">
          <h2 className="text-xl font-bold text-[#64FFDA] mb-2">
            Generated Output:
          </h2>
          {outputText.map((text, index) => (
            <div
              key={index}
              className="flex justify-between items-center my-2 p-2 rounded-xl bg-[#133267]"
            >
              <p className="text-[#CCD6F6]">{text}</p>
              <button
                onClick={() => copyToClipboard(text, index)}
                className="flex items-center justify-center p-1 rounded hover:bg-[#64FFDA] hover:text-[#0A192F]"
              >
                {copySuccessIndex === index ? (
                  <IoMdDoneAll />
                ) : (
                  <MdOutlineContentCopy />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmojiTranslator;
