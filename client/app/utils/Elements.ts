import { ElementStyles } from "../types/Element";

export const isTextOnly = (el: HTMLElement): boolean => {
  return (
    el.childNodes.length === 1 &&
    el.childNodes[0].nodeType === Node.TEXT_NODE &&
    (el.textContent?.trim().length ? el.textContent?.trim().length > 0 : false)
  );
};

export const isImageElement = (el: HTMLElement): boolean => {
  const isImgTag = el.tagName === "IMG";

  const hasSingleImgChild =
    el.querySelectorAll("img").length === 1 && el.children.length === 1;

  const bg = window.getComputedStyle(el).backgroundImage;
  const hasBackgroundImage = Boolean(
    bg && bg !== "none" && bg.includes("url(")
  );

  return isImgTag || hasSingleImgChild || hasBackgroundImage;
};

export const isLayoutElement = (el: HTMLElement): boolean => {
  const layoutTags = ["DIV", "SECTION", "MAIN", "HEADER", "FOOTER"];
  const hasNoText = !el.textContent?.trim();
  const hasChildren = el.children.length > 0;
  return layoutTags.includes(el.tagName) && hasNoText && hasChildren;
};

export function rgbToHex(rgb: string): string {
  if (!rgb) return "";

  const lower = rgb.toLowerCase();

  // Handle common "transparent" background formats
  if (
    lower === "transparent" ||
    lower === "rgba(0, 0, 0, 0)" ||
    lower === "rgb(0, 0, 0)" ||
    lower === "rgba(0,0,0,0)" ||
    lower.includes("0, 0, 0, 0")
  ) {
    return ""; // Return empty to imply "no override" or "default"
  }

  const result = lower
    .match(/\d+/g)
    ?.slice(0, 3)
    .map((x) => parseInt(x).toString(16).padStart(2, "0"))
    .join("");

  return result ? `#${result}` : "";
}

export function camelToKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

export const resetStyles = (el: HTMLElement, styles: ElementStyles) => {
  el.style.color = styles.color;
  el.style.backgroundColor = styles.backgroundColor;
  el.style.fontWeight = styles.fontWeight;
};
