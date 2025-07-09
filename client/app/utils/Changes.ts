const makeChanges = (
  sections: {
    selector: string;
    code: string;
    action: "add" | "edit" | "delete";
  }[],
  document: HTMLIFrameElement | null
): string | void => {
  if (!document) return;
  const doc = document.contentDocument;

  sections.forEach((section) => {
    const element = doc?.querySelector(section.selector);
    if (element) {
      if (section.action === "add") {
        element.innerHTML += section.code;
      } else {
        element.innerHTML = section.code;
      }
    }
  });

  return doc?.documentElement.outerHTML || "";
};

export default makeChanges;
