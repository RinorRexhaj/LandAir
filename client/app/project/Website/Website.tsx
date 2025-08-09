import useChange from "@/app/hooks/useChange";
import { useProjectStore } from "@/app/store/useProjectsStore";
import { ElementPos } from "@/app/types/Element";
import {
  isImageElement,
  isLayoutElement,
  isTextOnly,
} from "@/app/utils/Elements";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ActionElements from "./ActionElements";
import ChangesBar from "./ChangesBar";
import EditModal from "./EditModal";

interface WebsiteProps {
  selector: boolean;
  setSelector: (sel: boolean) => void;
  mobile: number;
  scale: number;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  setChanged: (changed: boolean) => void;
  selectedElement: ElementPos | null;
  setSelectedElement: (el: ElementPos | null) => void;
}

const Website: React.FC<WebsiteProps> = ({
  selector,
  setSelector,
  mobile,
  scale,
  iframeRef,
  setChanged,
  selectedElement,
  setSelectedElement,
}) => {
  const [toolBarPos, setToolBarPos] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [elementType, setElementType] = useState<
    "text" | "image" | "layout" | null
  >(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [selectedVisible, setSelectedVisible] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<ElementPos | null>(null);
  const { removeDisableInteractionStyle } = useChange();
  const { selectedProject } = useProjectStore();
  const [showTextEditModal, setShowTextEditModal] = useState(false);
  const [modalTextValue, setModalTextValue] = useState("");

  // Refs to keep latest values for event handlers
  const hoveredElementRef = useRef<ElementPos | null>(null);
  const selectedElementRef = useRef<ElementPos | null>(null);

  // Keep refs in sync with state
  useEffect(() => {
    hoveredElementRef.current = hoveredElement;
  }, [hoveredElement]);
  useEffect(() => {
    selectedElementRef.current = selectedElement;
  }, [selectedElement]);

  const updateHoverPos = useCallback(
    (target: HTMLElement | undefined) => {
      if (!target) {
        setHoveredElement(null);
        return;
      }
      if (!iframeRef.current) return;
      const rect = target.getBoundingClientRect();
      const iframeRect = iframeRef.current.getBoundingClientRect();

      // Calculate scaled position and size
      let left = iframeRect.left + rect.left * scale;
      let top = iframeRect.top + rect.top * scale;
      let width = rect.width * scale;
      let height = rect.height * scale;

      // Clamp to iframe bounds
      const maxLeft = iframeRect.left + iframeRect.width;
      const maxTop = iframeRect.top + iframeRect.height;

      if (left < iframeRect.left) {
        width -= iframeRect.left - left;
        left = iframeRect.left;
      }
      if (top < iframeRect.top) {
        height -= iframeRect.top - top;
        top = iframeRect.top;
      }
      if (left + width > maxLeft) {
        width = maxLeft - left;
      }
      if (top + height > maxTop) {
        height = maxTop - top;
      }

      // Only show if still visible
      setHoveredElement({
        element: target,
        height,
        width,
        left,
        top,
      });
    },
    [iframeRef, scale]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const iframeDoc =
        iframeRef.current?.contentDocument ||
        iframeRef.current?.contentWindow?.document;
      if (!iframeDoc || !iframeDoc.body) return;

      const target = iframeDoc.elementFromPoint(
        e.clientX,
        e.clientY
      ) as HTMLElement | null;

      if (!target) return;

      updateHoverPos(target);
    },
    [iframeRef, updateHoverPos]
  );

  const handleMouseLeave = useCallback(() => {
    updateHoverPos(undefined);
  }, [updateHoverPos]);

  const updateToolbarPos = useCallback(
    (target: HTMLElement | null | undefined) => {
      const element = target || selectedElement?.element;
      if (!element || !iframeRef.current) return;

      const rect = element.getBoundingClientRect();
      const clientHeight = iframeRef.current.clientHeight;
      const clientWidth = iframeRef.current.clientWidth;

      const elementHeight = rect.height * scale;
      const visibleHeight = clientHeight * scale;

      let top: number;
      let left: number = rect.x * scale;

      // Vertical positioning logic
      if (elementHeight >= visibleHeight - 100) {
        top = rect.bottom * scale - 30;
      } else {
        top =
          rect.y * scale < 50 ? rect.bottom * scale + 2 : rect.y * scale - 33;
        if (document.body.clientWidth < 768) {
          top += 33;
        }
      }

      // Horizontal positioning constraints
      const toolbarWidth = 200; // set this to your actual toolbar width
      const padding = 12;

      if (left + toolbarWidth > clientWidth * scale - padding) {
        left = clientWidth * scale - toolbarWidth - padding;
      }
      if (left < padding) {
        left = padding;
      }

      setToolBarPos({ top, left });
    },
    [iframeRef, scale, selectedElement?.element]
  );

  const updateClickPos = useCallback(
    (target: HTMLElement | undefined) => {
      if (!target) {
        setSelectedElement(null);
        return;
      }
      if (!iframeRef.current) return;
      const rect = target.getBoundingClientRect();
      const iframeRect = iframeRef.current.getBoundingClientRect();

      // Calculate scaled position and size
      let left = iframeRect.left + rect.left * scale;
      let top = iframeRect.top + rect.top * scale;
      let width = rect.width * scale;
      let height = rect.height * scale;

      // Clamp to iframe bounds
      const maxLeft = iframeRect.left + iframeRect.width;
      const maxTop = iframeRect.top + iframeRect.height;

      if (left < iframeRect.left) {
        width -= iframeRect.left - left;
        left = iframeRect.left;
      }
      if (top < iframeRect.top) {
        height -= iframeRect.top - top;
        top = iframeRect.top;
      }
      if (left + width > maxLeft) {
        width = maxLeft - left;
      }
      if (top + height > maxTop) {
        height = maxTop - top;
      }

      // Only show if still visible
      setSelectedElement({
        element: target,
        height,
        width,
        left,
        top,
      });
      if (width > 0 && height > 0) {
        setSelectedVisible(true);
      } else {
        setSelectedVisible(false);
      }
    },
    [iframeRef, scale, setSelectedElement]
  );

  const handleClick = useCallback(
    (e: MouseEvent) => {
      const iframeDoc =
        iframeRef.current?.contentDocument ||
        iframeRef.current?.contentWindow?.document;
      if (!iframeDoc || !iframeDoc.body) return;
      const target = iframeDoc.elementFromPoint(
        e.clientX,
        e.clientY
      ) as HTMLElement | null;
      if (!target) return;

      if (isImageElement(target)) {
        setElementType("image");
      } else if (isTextOnly(target)) {
        setElementType("text");
      } else if (isLayoutElement(target)) {
        setElementType("layout");
      } else {
        setElementType("layout");
      }

      setIsEditing(false);
      updateToolbarPos(target);
      updateClickPos(target);

      // Deselect if clicking the same element
      if (selectedElement?.element === target) {
        if (!isEditing) {
          setIsEditing(false);
          setSelectedElement(null);
          return;
        }
      }
    },
    [
      iframeRef,
      isEditing,
      selectedElement?.element,
      setSelectedElement,
      updateClickPos,
      updateToolbarPos,
    ]
  );

  const injectDisableInteractionStyle = useCallback(
    (iframeDoc: Document) => {
      iframeDoc.body.style.cursor = "crosshair";
      iframeDoc.body.querySelectorAll("*").forEach((el) => {
        const htmlEl = el as HTMLElement;
        const originalHref = htmlEl.getAttribute("href");
        if (originalHref) {
          htmlEl.setAttribute("data-original-href", originalHref);
        }
        htmlEl.removeAttribute("href");
        htmlEl.onmouseover = (e) => e.stopImmediatePropagation();
        htmlEl.onmouseenter = (e) => e.stopImmediatePropagation();
        htmlEl.onclick = (e) => {
          handleClick(e);
          e.stopImmediatePropagation();
        };
        htmlEl.onfocus = (e) => e.stopImmediatePropagation();
        htmlEl.onmousedown = (e) => e.stopImmediatePropagation();
        htmlEl.onmouseup = (e) => e.stopImmediatePropagation();
      });
    },
    [handleClick]
  );

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc || !iframeDoc.body) return;

    const scrollbarStyle = `
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background-color: rgba(100, 100, 100, 0.3);
        border-radius: 3px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background-color: rgba(100, 100, 100, 0.5);
      }
      body {
        scrollbar-width: thin;
        scrollbar-color: rgba(100, 100, 100, 0.3) transparent;
      }
    `;

    const injectScrollbarStyle = () => {
      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) return;

      const styleEl = iframeDoc.createElement("style");
      styleEl.innerHTML = scrollbarStyle;
      iframeDoc.head.appendChild(styleEl);
    };

    if (!selector) {
      removeDisableInteractionStyle(iframeDoc);
      setElementType(null);
      setSelectedElement(null);
    } else {
      injectDisableInteractionStyle(iframeDoc);
    }

    iframe.addEventListener("load", injectScrollbarStyle);
    iframeDoc.addEventListener("mousemove", handleMouseMove);
    iframeDoc.addEventListener("mouseleave", handleMouseLeave);

    const handleScrollOrResize = () => {
      updateToolbarPos(selectedElementRef.current?.element);
      updateHoverPos(hoveredElementRef.current?.element);
      updateClickPos(selectedElementRef.current?.element);
    };

    iframeDoc.addEventListener("scroll", handleScrollOrResize);
    iframe.contentWindow?.addEventListener("resize", handleScrollOrResize);

    return () => {
      iframe.removeEventListener("load", injectScrollbarStyle);
      iframeDoc.removeEventListener("mousemove", handleMouseMove);
      iframeDoc.removeEventListener("mouseleave", handleMouseLeave);
      iframeDoc.removeEventListener("scroll", handleScrollOrResize);
      iframe.contentWindow?.removeEventListener("resize", handleScrollOrResize);
    };
  }, [
    selector,
    isEditing,
    iframeRef,
    removeDisableInteractionStyle,
    setElementType,
    setSelectedElement,
    injectDisableInteractionStyle,
    handleMouseMove,
    handleMouseLeave,
    updateToolbarPos,
    updateHoverPos,
    updateClickPos,
    showTextEditModal,
  ]);

  const getWidth = () => {
    const width = document.body.clientWidth;
    return mobile ? (width > 500 ? "430px" : "100vw") : "1440px";
  };

  const getHeight = () => {
    const height = document.body.clientHeight;
    const width = document.body.clientWidth;
    const extra = (height * 200) / width + 20;
    const mobileExtra =
      (height > width ? height / width : width / height) +
      (height > width ? height / width : width / height) * 3;
    if (mobile) return `calc(${scale * 100 + mobileExtra}dvh)`;
    let finalHeight = height * (1 / scale) - extra;
    if (width < 768) finalHeight -= 250;
    return finalHeight;
  };

  // const getHeight = () => document.body.clientHeight / scale - 113;

  if (!selectedProject) return;

  return (
    <div className="">
      <iframe
        ref={iframeRef}
        key={selectedProject.file}
        srcDoc={selectedProject.file}
        className={`rounded-xl shadow-md ${
          document.body.clientWidth < 768 ? "top-24" : ""
        }`}
        style={{
          border: "none",
          width: getWidth(),
          height: getHeight(),
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "fixed",
        }}
      />
      <ActionElements
        selectedElement={selectedElement}
        elementType={elementType}
        hoveredElement={hoveredElement}
        iframeRef={iframeRef}
        isEditing={isEditing}
        selector={selector}
        setHasUnsavedChanges={setHasUnsavedChanges}
        setIsEditing={setIsEditing}
        setModalTextValue={setModalTextValue}
        setSelectedElement={setSelectedElement}
        setShowTextEditModal={setShowTextEditModal}
        toolBarPos={toolBarPos}
        selectedVisible={selectedVisible}
      />
      <ChangesBar
        iframeRef={iframeRef}
        selectedElement={selectedElement}
        setChanged={setChanged}
        hasUnsavedChanges={hasUnsavedChanges}
        setHasUnsavedChanges={setHasUnsavedChanges}
        setIsEditing={setIsEditing}
        setSelectedElement={setSelectedElement}
        setSelector={setSelector}
      />
      {showTextEditModal && (
        <EditModal
          modalTextValue={modalTextValue}
          selectedElement={selectedElement}
          setHasUnsavedChanges={setHasUnsavedChanges}
          setModalTextValue={setModalTextValue}
          setSelectedElement={setSelectedElement}
          setShowTextEditModal={setShowTextEditModal}
          elementType={elementType}
        />
      )}
    </div>
  );
};

export default Website;
