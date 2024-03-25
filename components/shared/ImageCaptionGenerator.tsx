"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Image from "next/image";
import { MdOutlineContentCopy } from "react-icons/md";
import { useToast } from "../ui/use-toast";
import { IoMdDoneAll } from "react-icons/io";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Loader = () => (
  <div className="flex justify-center items-center w-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
  </div>
);

const ImageCaptionGenerator: React.FC = () => {
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
  const genAI = new GoogleGenerativeAI(API_KEY);
  const [outputText, setOutputText] = useState("");
  const [uploadedImage, setUploadedImage] = useState<
    string | ArrayBuffer | null
  >(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [copySuccessIndex, setCopySuccessIndex] = useState(-1);
  const [loader, setLoader] = useState(false);
  const [selectedTone, setSelectedTone] = useState("");

  const { toast } = useToast();

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopySuccessIndex(index);
        toast({
          title: "Caption copied to clipboard",
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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
        toast({
          title: "Image uploaded successfully!",
          duration: 3000,
          className: "success-toast",
        });
      };
      reader.readAsDataURL(file);
      setSelectedFile(file); // Store the selected file for later use
    }
  }, []);

  const generateCaption = async () => {
    if (loader) return;
    setLoader(true);
    if (outputText) {
      setOutputText("");
    }
    if (!selectedFile) {
      console.error("No file selected.");
      return;
    }

    try {
      const imagePart = await fileToGenerativePart(selectedFile);
      const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
      const prompt = `Generate 3 captions for this image in English within 20 words. Tone: ${selectedTone}`;

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = await response.text();
      console.log("response:", text);
      setOutputText(text);
    } catch (error) {
      console.error("Error generating content:", error);
    }
  };

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

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  const captions = outputText.split("\n").filter((caption) => caption.trim());

  const onSelectChangeHandler = (value: string) => {
    setSelectedTone(value);
  };

  return (
    <div className="flex flex-col m-7 p-6 gap-10 bg-slate-800/50 min-h-[90vh]">
      <div className="flex justify-center items-center flex-col mt-5">
        <h1 className="text-4xl font-bold text-lime-200 mb-4">
          Image Caption Generator
        </h1>
        <p className="text-lime-50 text-center max-w-[900px]">
          Generate captions for images using AI. Upload an image and get a
          caption generated for it. 
        </p>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center p-5 gap-5">
        <div className="flex-1 max-w-[400px] w-full">
          {!uploadedImage && (
            <div
              {...getRootProps()}
              className="dropzone bg-[#112240] p-4 rounded cursor-pointer mt-4 border-2 border-dashed border-[#64FFDA] text-[#8892B0] text-center h-96 flex justify-center items-center flex-col mx-auto"
            >
              <input {...getInputProps()} />
              <p>
                Drag &apos;n&apos; drop some files here, or click to select
                files
              </p>
            </div>
          )}
          {uploadedImage && (
            <div className="w-fit">
              <Image
                width={384}
                height={384}
                src={uploadedImage as string}
                alt="Uploaded"
                className="object-cover rounded-lg h-96 w-96"
              />
              <div
                className="w-full text-right"
                onClick={() => setUploadedImage(null)}
              >
                <span
                  className="cursor-pointer underline text-green-50 hover:text-green-200"
                  onClick={() => setUploadedImage(null)}
                >
                  Remove Image
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="flex-1 max-w-[400px] w-full flex flex-col gap-3 items-center justify-center">
          <Select onValueChange={onSelectChangeHandler}>
            <SelectTrigger className="w-full bg-slate-300 text-black rounded">
              <SelectValue placeholder="Select Tone" />
            </SelectTrigger>
            <SelectContent className="bg-slate-300 cursor-pointer">
              <SelectItem value="funny" className="bg-gray-100 cursor-pointer">
                Funny 😂
              </SelectItem>
              <SelectItem
                value="serious"
                className="bg-gray-100 cursor-pointer"
              >
                Serious 😐
              </SelectItem>
              <SelectItem value="happy" className="bg-gray-100 cursor-pointer">
                Happy 😊
              </SelectItem>
              <SelectItem
                value="excited"
                className="bg-gray-100 cursor-pointer"
              >
                Excited 😃
              </SelectItem>
              <SelectItem value="angry" className="bg-gray-100 cursor-pointer">
                Angry 😡
              </SelectItem>
              <SelectItem value="sad" className="bg-gray-100 cursor-pointer">
                Sad 😢
              </SelectItem>
              <SelectItem value="scary" className="bg-gray-100 cursor-pointer">
                Scary 😱
              </SelectItem>
              <SelectItem
                value="romantic"
                className="bg-gray-100 cursor-pointer"
              >
                Romantic 😍
              </SelectItem>
              <SelectItem
                value="mysterious"
                className="bg-gray-100 cursor-pointer"
              >
                Mysterious 🕵️
              </SelectItem>
              <SelectItem
                value="inspiring"
                className="bg-gray-100 cursor-pointer"
              >
                Inspiring 🌟
              </SelectItem>
              <SelectItem
                value="informative"
                className="bg-gray-100 cursor-pointer"
              >
                Informative 📚
              </SelectItem>
              <SelectItem
                value="persuasive"
                className="bg-gray-100 cursor-pointer"
              >
                Persuasive 🗣
              </SelectItem>
              <SelectItem
                value="insightful"
                className="bg-gray-100 cursor-pointer"
              >
                Insightful 🤔
              </SelectItem>
              <SelectItem
                value="emotional"
                className="bg-gray-100 cursor-pointer"
              >
                Emotional 😢
              </SelectItem>
              <SelectItem
                value="dramatic"
                className="bg-gray-100 cursor-pointer"
              >
                Dramatic 🎭
              </SelectItem>
              <SelectItem
                value="humorous"
                className="bg-gray-100 cursor-pointer"
              >
                Humorous 😆
              </SelectItem>
              <SelectItem value="ironic" className="bg-gray-100 cursor-pointer">
                Ironic 😏
              </SelectItem>
              <SelectItem value="witty" className="bg-gray-100 cursor-pointer">
                Witty 😏
              </SelectItem>
              <SelectItem
                value="cheerful"
                className="bg-gray-100 cursor-pointer"
              >
                Cheerful 😄
              </SelectItem>
              <SelectItem
                value="playful"
                className="bg-gray-100 cursor-pointer"
              >
                Playful 😜
              </SelectItem>
              <SelectItem
                value="optimistic"
                className="bg-gray-100 cursor-pointer"
              >
                Optimistic 😌
              </SelectItem>
              <SelectItem
                value="pessimistic"
                className="bg-gray-100 cursor-pointer"
              >
                Pessimistic 😞
              </SelectItem>
              <SelectItem
                value="hopeful"
                className="bg-gray-100 cursor-pointer"
              >
                Hopeful 🙏
              </SelectItem>
              <SelectItem value="dreamy" className="bg-gray-100 cursor-pointer">
                Dreamy 😌
              </SelectItem>
              <SelectItem
                value="magical"
                className="bg-gray-100 cursor-pointer"
              >
                Magical 🧙
              </SelectItem>
            </SelectContent>
          </Select>
          <button
            type="button"
            onClick={generateCaption}
            disabled={loader}
            className="bg-[#64FFDA] hover:bg-[#45dcb9] text-[#0A192F] font-bold py-2 px-4 rounded w-full flex items-center justify-center gap-2 disabled:bg-[#45dcb9]"
          >
            {loader ? <Loader /> : "Generate Caption"}
          </button>
        </div>
      </div>
      <div
        className={`${
          outputText ? "w-[80vw] md:w-[70vw] flex flex-col mx-auto" : "hidden"
        } mt-4 text-[#CCD6F6] bg-[#112240] p-4 rounded-xl`}
      >
        <h2 className="text-xl font-bold text-[#64FFDA] mb-2">
          Generated Caption:
        </h2>
        {captions.map((caption, index) => (
          <div
            key={index}
            className="flex justify-between items-center my-2 p-2 rounded-xl bg-[#133267]"
          >
            <p className="text-[#CCD6F6]">{caption}</p>
            <button
              className="flex items-center justify-center p-1 rounded"
              onClick={() => copyToClipboard(caption, index)}
            >
              {copySuccessIndex === index ? (
                <IoMdDoneAll className="text-[#64FFDA]" />
              ) : (
                <MdOutlineContentCopy />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCaptionGenerator;
