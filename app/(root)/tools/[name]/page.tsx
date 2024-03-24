import EmojiTranslator from "@/components/shared/EmojiTranslator";
import ImageCaptionGenerator from "@/components/shared/ImageCaptionGenerator";
import React from "react";

const ToolsPage = ({ params }: { params: { name: string } }) => {
    const tooltype = params.name;
  return (
    <div className="text-white">
      {
        tooltype == "caption" && <ImageCaptionGenerator/>
      }
      {
        tooltype == "emoji-translator" && <EmojiTranslator/>
      }
    </div>
  );
};

export default ToolsPage;
