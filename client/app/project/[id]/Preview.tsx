import { useProjectStore } from "@/app/store/useProjectsStore";
import React, { useEffect, useRef, useState } from "react";
import Code from "./Code";
import Website from "./Website";
import PreviewHeader from "./PreviewHeader";

interface PreviewProps {
  getUrl: () => void;
}

const Preview: React.FC<PreviewProps> = ({ getUrl }) => {
  const [mobile, setMobile] = useState(0);
  const [selector, setSelector] = useState(false);
  const [scale, setScale] = useState(1);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const { selectedProject } = useProjectStore();

  useEffect(() => {
    const updateScale = () => {
      if (mainRef.current) {
        let containerWidth = mainRef.current.clientWidth;
        const smallDevice = document.body.clientWidth < 500;
        // const mediumDevice = document.body.clientWidth < 1000;
        let divider = 1440;
        const clientWidth = document.body.clientWidth;
        const clientHeight = document.body.clientHeight;
        if (clientWidth < 500 && mobile === 0) {
          setMobile(1);
        }
        if (mobile) {
          divider = 1000;
          if (!smallDevice) {
            containerWidth = 900;
          } else {
            containerWidth =
              divider * (0.9 + clientWidth / (clientHeight * 20));
          }
        }
        // else {
        //   if (mediumDevice) {
        //     containerWidth = 800;
        //   } else {
        //   }
        // }
        setScale(containerWidth / divider);
      }
    };

    if (mobile === 2) {
      setSelector(false);
    }

    window.addEventListener("resize", updateScale);
    updateScale();
    return () => window.removeEventListener("resize", updateScale);
  }, [mobile]);

  return (
    <div
      className="relative w-full h-full flex flex-col gap-3 animate-fade"
      ref={mainRef}
    >
      <PreviewHeader
        mobile={mobile}
        setMobile={setMobile}
        selector={selector}
        setSelector={setSelector}
      />

      {/* Preview Area */}
      <div className={`relative w-full h-full flex overflow-hidden`}>
        {(scale < 1 || mobile) && selectedProject?.file && mobile < 2 && (
          <Website
            selector={selector}
            setSelector={setSelector}
            mobile={mobile}
            scale={scale}
          />
        )}
        {mobile === 2 && (
          <Code file={selectedProject?.file || ""} getUrl={getUrl} />
        )}
      </div>
    </div>
  );
};

export default Preview;
