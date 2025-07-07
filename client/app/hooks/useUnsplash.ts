import { useState } from "react";
import useApi from "./useApi";
import { Unsplash } from "../types/Unsplash";

const useUnsplash = () => {
  const [loading, setLoading] = useState(false);
  const { get } = useApi();

  const enhanceImages = async (fileOutput: string): Promise<string> => {
    setLoading(true);

    // Match all <img ...> tags with src and alt attributes
    const imgTagRegex = /<img\s+[^>]*?alt="([^"]+)"[^>]*?>/g;
    const imgSrcRegex = /src="([^"]*)"/;

    const imgTags = [...fileOutput.matchAll(imgTagRegex)];

    const replacements = await Promise.all(
      imgTags.map(async (match) => {
        const altText = match[1];
        const imgTag = match[0];
        console.log(altText);

        try {
          const data: Unsplash = await get(`/api/images?words=${altText}`);
          const imageUrl = data?.results[0]?.urls?.regular;

          if (!imageUrl) return null;

          const newImgTag = imgTag.replace(imgSrcRegex, `src="${imageUrl}"`);
          return { oldTag: imgTag, newTag: newImgTag };
        } catch (err) {
          console.error("Unsplash API error:", err);
          return null;
        }
      })
    );

    const updatedHTML = replacements.reduce((html, rep) => {
      if (!rep) return html;
      return html.replace(rep.oldTag, rep.newTag);
    }, fileOutput);

    setLoading(false);
    return updatedHTML;
  };

  return { enhanceImages, loading };
};

export default useUnsplash;
