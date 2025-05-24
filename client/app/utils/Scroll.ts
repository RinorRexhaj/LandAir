const handleScroll = (element: HTMLElement | null) => {
  if (!element) return;
  console.log(document.body.clientWidth);
  setTimeout(() => {
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
    }
  }, 100);
};

export { handleScroll };
