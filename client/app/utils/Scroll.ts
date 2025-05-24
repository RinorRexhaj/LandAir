const handleScroll = (element: HTMLElement | null) => {
  if (!element) return;
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
