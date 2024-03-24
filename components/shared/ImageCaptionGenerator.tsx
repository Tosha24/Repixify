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
          duration: 5000,
          className: "success-toast",
        });
      },
      (err) =>
        toast({
          title: "Cannot copy to clipboard",
          description: "Try again",
          duration: 5000,
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
    <div className="flex flex-col max-h-[100vh] mt-14 gap-10">
      <div className="flex justify-center items-center flex-col mt-5">
        <h1 className="text-4xl font-bold text-yellow-400/80 mb-4">
          Image Caption Generator
        </h1>
        <p className="text-lime-100 text-center max-w-[900px]">
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
            <Image
              width={384}
              height={384}
              src={uploadedImage as string}
              alt="Uploaded"
              className="object-cover rounded-lg"
              layout="responsive"
            />
          )}
        </div>
        <div className="flex-1 max-w-[400px] w-full flex flex-col gap-3 items-center justify-center">
          <Select onValueChange={onSelectChangeHandler}>
            <SelectTrigger className="w-full bg-slate-300 text-black">
              <SelectValue placeholder="Select Tone" />
            </SelectTrigger>
            <SelectContent className="bg-slate-300">
              <SelectItem value="funny" className="bg-gray-100">
                Funny
              </SelectItem>
              <SelectItem value="serious" className="bg-gray-100">
                Serious
              </SelectItem>
              <SelectItem value="happy" className="bg-gray-100">
                Happy
              </SelectItem>
              <SelectItem value="excited" className="bg-gray-100">
                Excited
              </SelectItem>
              <SelectItem value="angry" className="bg-gray-100">
                Angry
              </SelectItem>
              <SelectItem value="sad" className="bg-gray-100">
                Sad
              </SelectItem>
              <SelectItem value="scary" className="bg-gray-100">
                Scary
              </SelectItem>
              <SelectItem value="romantic" className="bg-gray-100">
                Romantic
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
          <div
            className={`${
              outputText ? "w-full" : "hidden"
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
                  className="flex items-center justify-center p-1 rounded hover:bg-[#64FFDA] hover:text-[#0A192F]"
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
      </div>
    </div>
  );
};

export default ImageCaptionGenerator;