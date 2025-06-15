import { useProjectStore } from "@/app/store/useProjectsStore";
import React, { useEffect, useRef } from "react";

interface WebsiteProps {
  selector: boolean;
  mobile: number;
  scale: number;
  selectedElement: HTMLElement | null;
  setSelectedElement: (el: HTMLElement | null) => void;
}

const Website: React.FC<WebsiteProps> = ({
  selector,
  mobile,
  scale,
  selectedElement,
  setSelectedElement,
}) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const { selectedProject } = useProjectStore();

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !selectedProject?.file) return;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc || !iframeDoc.body) return;

    if (!selector) {
      iframeDoc.querySelectorAll("*").forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.backgroundColor = "";
          el.style.background = "";
          el.style.outline = "";
        }
      });
      if (selectedElement) {
        selectedElement.style.backgroundColor = "";
        selectedElement.style.background = "";
        selectedElement.style.outline = "";
      }
      setSelectedElement(null);
      return;
    }

    let lastHoveredElement: HTMLElement | null = null;
    let lastHoveredOriginalBg = "";
    let lastHoveredOriginalOutline = "";

    const HOVER_COLOR = "rgba(29, 45, 255, 0.5)";
    const SELECT_COLOR = "rgba(29, 45, 255, 0.25)";
    const SELECT_OUTLINE = "3px dotted #1d2dff";

    const handleMouseMove = (e: MouseEvent) => {
      const target = iframeDoc.elementFromPoint(
        e.clientX,
        e.clientY
      ) as HTMLElement | null;

      if (!target || target === lastHoveredElement) return;

      // Restore styles of last hovered element
      if (lastHoveredElement && lastHoveredElement !== selectedElement) {
        lastHoveredElement.style.backgroundColor = lastHoveredOriginalBg;
        lastHoveredElement.style.outline = lastHoveredOriginalOutline;
      }

      lastHoveredOriginalBg = target.style.backgroundColor || "";
      lastHoveredOriginalOutline = target.style.outline || "";
      lastHoveredElement = target;

      // Apply hover styles
      if (target !== selectedElement) {
        target.style.backgroundColor = HOVER_COLOR;
        target.style.outline = "1px dashed #1d2dff";
      }
    };

    const handleMouseLeave = () => {
      if (lastHoveredElement && lastHoveredElement !== selectedElement) {
        lastHoveredElement.style.backgroundColor = lastHoveredOriginalBg;
        lastHoveredElement.style.outline = lastHoveredOriginalOutline;
        lastHoveredElement = null;
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = iframeDoc.elementFromPoint(
        e.clientX,
        e.clientY
      ) as HTMLElement | null;
      if (!target) return;

      // Deselect if clicking the same element
      if (selectedElement === target) {
        target.style.backgroundColor = "";
        target.style.outline = "";
        setSelectedElement(null);
        return;
      }

      // Clear previous selection
      if (selectedElement) {
        selectedElement.style.backgroundColor = "";
        selectedElement.style.outline = "";
      }

      // Apply selection styles
      target.style.backgroundColor = SELECT_COLOR;
      target.style.outline = SELECT_OUTLINE;
      setSelectedElement(target);
    };

    iframeDoc.addEventListener("mousemove", handleMouseMove);
    iframeDoc.addEventListener("mouseleave", handleMouseLeave);
    iframeDoc.addEventListener("click", handleClick);

    return () => {
      iframeDoc.removeEventListener("mousemove", handleMouseMove);
      iframeDoc.removeEventListener("mouseleave", handleMouseLeave);
      iframeDoc.removeEventListener("click", handleClick);
    };
  }, [selector, selectedProject, selectedElement, setSelectedElement]);

  const injectLinkFixScript = (html: string | undefined): string => {
    if (!html) return "";
    const script = `
    <script>
      document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll("a").forEach(a => {
          a.setAttribute("target", "_self");
          a.addEventListener("click", function (e) {
            const href = a.getAttribute("href");
            if (['#', '', ''javascript:void(0)]'.includes(href) || href.startsWith('#')) {
              e.preventDefault();
            }
          });
        });
      });
    <\/script>
  `;
    return html + script;
  };

  if (!selectedProject) return;

  return (
    <iframe
      ref={iframeRef}
      key={selectedProject.file}
      srcDoc={injectLinkFixScript(selectedProject?.file)}
      className="rounded-lg shadow-md"
      style={{
        border: "none",
        width: mobile ? "430px" : "1440px",
        transform: `scale(${scale})`,
        height: mobile ? "calc(100vh - 100px)" : "100vh",
        transformOrigin: "top left",
        position: "fixed",
      }}
    />
  );
};

export default Website;
