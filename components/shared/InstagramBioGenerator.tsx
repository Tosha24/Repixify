"use client";
import React, { useState } from "react";
import { useToast } from "../ui/use-toast";
import { MdOutlineContentCopy } from "react-icons/md";
import { IoMdDoneAll } from "react-icons/io";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming TextArea component exists
import { GoogleGenerativeAI } from "@google/generative-ai";

const Loader = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
  </div>
);

const InstagramBioGenerator: React.FC = () => {
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
  const genAI = new GoogleGenerativeAI(API_KEY);
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [hobby, setHobby] = useState("");
  const [description, setDescription] = useState("");
  const [bioFor, setBioFor] = useState("");
  const [tone, setTone] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Content copied to clipboard",
          duration: 3000,
          className: "success-toast",
        });
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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

  const generateBio = async (): Promise<void> => {
    if (loading) return;
    setLoading(true);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Generate an Instagram bio for a ${bioFor} named ${name} who enjoys ${hobby}, described as: ${description}. The tone should be ${tone}.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const answer = await response.text();
      setBio(answer);
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Error generating bio",
        description: "Please try again",
        duration: 3000,
        className: "error-toast",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-6 gap-10 bg-slate-800/50 min-h-[100vh]">
      {/* Title and Description */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-lime-200 mb-4">
          Instagram Bio Generator
        </h1>
        <p className="text-lime-50">
          Generate a creative bio for your Instagram profile.
        </p>
      </div>

      {/* Input Fields */}
      <div className="flex flex-col gap-5 w-[600px] justify-center items-center m-auto rounded">
        <Input
          placeholder="Enter your name or brand name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded text-white"
        />

        <Select onValueChange={setBioFor}>
          <SelectTrigger className="bg-slate-300 text-black w-full rounded">
            <SelectValue placeholder="This bio is for" />
          </SelectTrigger>
          <SelectContent className="bg-slate-300">
            <SelectItem
              className="bg-gray-100 cursor-pointer"
              value="individual"
            >
              An Individual
            </SelectItem>
            <SelectItem className="bg-gray-100 cursor-pointer" value="business">
              A Business
            </SelectItem>
            <SelectItem className="bg-gray-100 cursor-pointer" value="page">
              A Page/Other
            </SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Enter a hobby or interest"
          value={hobby}
          onChange={(e) => setHobby(e.target.value)}
          className="w-full rounded text-white"
        />
        <Textarea
          placeholder="Write a short description about yourself or your business"
          value={description}
          onChange={(e: any) => setDescription(e.target.value)}
          className="w-full rounded text-white h-32"
        />

        <Select onValueChange={setTone}>
          <SelectTrigger className="bg-slate-300 text-black w-full rounded">
            <SelectValue placeholder="Select a tone" />
          </SelectTrigger>
          <SelectContent className="bg-slate-300">
            <SelectItem className="bg-gray-100 cursor-pointer" value="funny">
              Funny
            </SelectItem>
            <SelectItem
              className="bg-gray-100 cursor-pointer"
              value="inspirational"
            >
              Inspirational
            </SelectItem>
            <SelectItem
              className="bg-gray-100 cursor-pointer"
              value="motivational"
            >
              Motivational
            </SelectItem>
            <SelectItem
              className="bg-gray-100 cursor-pointer"
              value="Bullet Points"
            >
              Bullet Points
            </SelectItem>
          </SelectContent>
        </Select>

        <button
          onClick={generateBio}
          disabled={
            loading || !name || !hobby || !description || !tone || !bioFor
          }
          className="bg-[#64FFDA] w-full md:w-[300px] hover:bg-[#45dcb9] text-[#0A192F] font-bold py-2 px-4 rounded disabled:bg-[#45dcb9] flex items-center justify-center gap-2"
        >
          {loading ? <Loader /> : "Generate Bio"}
        </button>
      </div>

      {/* Output Section */}
      {bio && (
        <div className="w-[80vw] md:w-[70vw] flex flex-col mx-auto mt-0 text-[#CCD6F6] bg-[#112240] p-4 rounded-xl">
          <h2 className="text-xl font-bold text-[#64FFDA] mb-2">
            Your Instagram Bio:
          </h2>
          <div className="flex justify-between items-center my-2 p-2 rounded-xl bg-[#133267]">
            <p className="text-[#CCD6F6] break-words">{bio}</p>
            <button
              className="flex items-center justify-center p-1 rounded"
              onClick={() => copyToClipboard(bio)}
            >
              {copied ? (
                <IoMdDoneAll className="text-[#64FFDA] text-2xl" />
              ) : (
                <MdOutlineContentCopy className="text-[#64FFDA] text-2xl" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstagramBioGenerator;
