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

  try {
    // ✅ Wait for Google Fonts to load
    await iframeDoc.fonts?.ready;

    // ✅ Wait for all images in the section
    await Promise.all(
      Array.from(section.querySelectorAll("img")).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );

    // ✅ Take screenshot
    const canvas = await html2canvas(section as HTMLElement, {
      useCORS: true,
      backgroundColor: null,
      scale: 1,
    });

    const tmpCanvas = document.createElement("canvas");
    const ctx = tmpCanvas.getContext("2d");

    const scaleFactor = 0.5; // shrink to 50%
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

    const file = new File([blob], "screenshot.png", { type: "image/png" });
    console.log(file);
    return file;
  } catch (err) {
    console.error("Screenshot capture failed", err);
    return;
  }
};
