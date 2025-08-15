import { RefObject } from "react";
import { useCreditStore } from "../store/useCreditStore";
import { useProjectStore } from "../store/useProjectsStore";
import { ChatMessage } from "../types/Chat";
import { ChangeOutput } from "../types/Relevance";
import makeChanges from "../utils/Changes";
import { extractTextFromHTML } from "../utils/ProjectActions";
import {
  createIframe,
  removeIframe,
  takeScreenshot,
} from "../utils/Screenshot";
import { supabase } from "../utils/Supabase";
import useApi from "./useApi";
import useToast from "./useToast";
import { ElementPos } from "../types/Element";

const token = await supabase.auth
  .getSession()
  .then(({ data }) => data?.session?.access_token);

const useGenerate = () => {
  const { selectedProject, setSelectedProject, changeProject } =
    useProjectStore();
  const { post, put } = useApi();
  const toast = useToast();
  const { setCredits } = useCreditStore();

  const generateWebsite = async (
    prompt: string,
    setCompletion: (completion: string) => void,
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
    setTaskType: (type: string) => void,
    iframeRef: RefObject<HTMLIFrameElement | null>
  ) => {
    try {
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: "generate", prompt }),
      });

      if (!res.body) throw new Error("No response body from server");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let file = "";

      // ✅ Placeholder while loading
      if (selectedProject?.id && !selectedProject?.file) {
        setSelectedProject({
          ...selectedProject,
          file: "<html><body><p style='text-align:center; color:white; font-size: 32px; font-weight:600;font-family: Arial; margin-top:200px;'>Loading preview...</p></body></html>",
        });
      }

      // ✅ Inject style to disable interactions & animations during generation
      injectDisableStyle(iframeRef);

      let updateTimer: ReturnType<typeof setTimeout> | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        let chunk = decoder.decode(value, { stream: true });
        chunk = stripCodeFences(chunk);

        file += chunk;

        if (updateTimer) clearTimeout(updateTimer);
        updateTimer = setTimeout(() => {
          if (iframeRef.current?.contentDocument) {
            iframeRef.current.contentDocument.open();
            iframeRef.current.contentDocument.write(file);
            iframeRef.current.contentDocument.close();
            injectDisableStyle(iframeRef); // re-apply after writing
          }
        }, 100);
      }

      // ✅ Clean up disable style now that it's done
      removeDisableStyle(iframeRef);

      file = stripCodeFences(file);

      // Save final file
      if (selectedProject?.id) {
        setSelectedProject({ ...selectedProject, file });
      }

      await saveWebsite(file, "generate");
      const mainText = extractTextFromHTML(file);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 10,
          sender: false,
          message: "",
          projectId: String(selectedProject?.id),
        },
      ]);
      setTaskType("summary");
      return await summarizeWebsite(mainText, setCompletion);
    } catch (error) {
      console.error(error);
      toast.error("Generation failed!");
      return "";
    }
  };

  const summarizeWebsite = async (
    prompt: string,
    setCompletion: (completion: string) => void
  ) => {
    const res = await fetch("/api/prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ type: "summary", prompt }),
    });

    if (!res.body) throw new Error("No response body from server");

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;
      setCompletion(fullText);
    }

    return fullText;
  };

  const changeWebsite = async (
    prompt: string,
    iframe: HTMLIFrameElement,
    selectedElement: ElementPos | null
  ) => {
    const { code, summary }: { code: ChangeOutput[]; summary: string } =
      await post(`/api/prompt`, {
        prompt,
        type: "changes",
        code: selectedElement?.element.outerHTML || selectedProject?.file,
      });
    const newCode = makeChanges(code, iframe);
    if (newCode) {
      await saveWebsite(newCode, "changes");
    }
    return summary;
  };

  const saveWebsite = async (code: string, type: "generate" | "changes") => {
    try {
      const filePath = `${selectedProject?.id}`;
      const formData = new FormData();
      formData.append("content", code);
      formData.append("filePath", filePath);
      formData.append("type", "html");

      await post("/api/storage/", formData);
      await put(`/api/projects/${selectedProject?.id}`, {
        new_name: selectedProject?.project_name,
      });

      const iframe = await createIframe(code);
      const screenshot = await takeScreenshot(iframe);
      if (screenshot) {
        const screenshotData = new FormData();
        screenshotData.append("content", screenshot);
        screenshotData.append(
          "filePath",
          `${selectedProject?.id}/screenshot.png`
        );
        screenshotData.append("type", "image");

        await post(`/api/storage/`, screenshotData);
        removeIframe();
      }

      if (type === "generate" && selectedProject?.id) {
        setSelectedProject({ ...selectedProject, created: false });
        changeProject({
          ...selectedProject,
          id: selectedProject?.id,
          created: false,
          last_edited: new Date(),
        });
      }

      const { credits }: { credits: number } = await put(`/api/credits`);
      setCredits(credits);
      toast.success(
        type === "generate" ? "Website Generated!" : "Changes saved!"
      );
    } catch (error) {
      console.error(error);
      toast.error("Save failed!");
    }
  };

  return { generateWebsite, changeWebsite };
};

const stripCodeFences = (html: string) => {
  return html
    .replace(/^```(?:html)?\s*/i, "") // remove starting ```html or ```
    .replace(/```$/, ""); // remove ending ```
};

const injectDisableStyle = (iframeRef: RefObject<HTMLIFrameElement | null>) => {
  const iframeDoc = iframeRef.current?.contentDocument;
  if (!iframeDoc) return;

  const disableStyleId = "disable-interactions-style";
  let style = iframeDoc.getElementById(disableStyleId);
  if (!style) {
    style = iframeDoc.createElement("style");
    style.id = disableStyleId;
    style.innerHTML = `
          * {
            pointer-events: none !important;
            transition: none !important;
            animation: none !important;
          }
        `;
    iframeDoc.head.appendChild(style);
  }
};
const removeDisableStyle = (iframeRef: RefObject<HTMLIFrameElement | null>) => {
  const disableStyleId = "disable-interactions-style";
  const iframeDoc = iframeRef.current?.contentDocument;
  iframeDoc?.getElementById(disableStyleId)?.remove();
};

export default useGenerate;
