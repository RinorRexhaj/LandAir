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
