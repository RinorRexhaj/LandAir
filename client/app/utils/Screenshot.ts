import html2canvas from "html2canvas";

export const takeScreenshot = async (
  iframe: HTMLIFrameElement
): Promise<File | undefined> => {
  const iframeDoc = iframe.contentDocument;
  if (!iframeDoc) {
    console.error("No iframe document available");
    return;
  }

  const section = iframeDoc.getElementById("home");
  if (!section) {
    console.error("No <section> element found inside iframe");
    return;
  }

  const sectionStyle = iframeDoc.defaultView?.getComputedStyle(section);
  const sectionBg = sectionStyle?.getPropertyValue("background-color");

  // Check if the section background is transparent or unset
  if (
    !sectionBg ||
    sectionBg === "transparent" ||
    sectionBg === "rgba(0, 0, 0, 0)"
  ) {
    const bodyStyle = iframeDoc.defaultView?.getComputedStyle(iframeDoc.body);
    const bodyBg = bodyStyle?.getPropertyValue("background-color");

    if (bodyBg && bodyBg !== "transparent" && bodyBg !== "rgba(0, 0, 0, 0)") {
      section.style.backgroundColor = bodyBg; // Inherit the background
    }
  }

  try {
    await iframeDoc.fonts?.ready;

    await Promise.all(
      Array.from(section.querySelectorAll("img")).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );

    const canvas = await html2canvas(section as HTMLElement, {
      useCORS: true,
      backgroundColor: null, // Use transparent unless overridden
      scale: 1,
    });

    const tmpCanvas = document.createElement("canvas");
    const ctx = tmpCanvas.getContext("2d");

    const scaleFactor = 0.5;
    tmpCanvas.width = canvas.width * scaleFactor;
    tmpCanvas.height = canvas.height * scaleFactor;

    ctx?.drawImage(canvas, 0, 0, tmpCanvas.width, tmpCanvas.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      tmpCanvas.toBlob((b) => resolve(b), "image/png", 0.8)
    );

    if (!blob) {
      console.error("Failed to create blob");
      return;
    }

    return new File([blob], "screenshot.png", { type: "image/png" });
  } catch (err) {
    console.error("Screenshot capture failed", err);
    return;
  }
};
