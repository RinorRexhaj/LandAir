import { useCreditStore } from "../store/useCreditStore";
import { useProjectStore } from "../store/useProjectsStore";
import {
  createIframe,
  removeIframe,
  takeScreenshot,
} from "../utils/Screenshot";
import { supabase } from "../utils/Supabase";
import useApi from "./useApi";
import useToast from "./useToast";

const token = await supabase.auth
  .getSession()
  .then(({ data }) => data?.session?.access_token);

const useGenerate = () => {
  const { selectedProject, setSelectedProject } = useProjectStore();
  const { post, put } = useApi();
  const toast = useToast();
  const { setCredits } = useCreditStore();

  const generateWebsite = async (prompt: string) => {
    try {
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: "generate", prompt }),
      });

      if (!res.body) {
        throw new Error("No response body from server");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let file = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        file += chunk;

        if (selectedProject?.id) {
          setSelectedProject({
            ...selectedProject,
            file,
          });
        }
      }

      await saveWebsite(file);
    } catch (error) {
      console.error(error);
      toast.error("Generation failed!");
    }
  };

  const saveWebsite = async (code: string) => {
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

      const { credits }: { credits: number } = await put(`/api/credits`);
      setCredits(credits);
      toast.success("Website Generated!");
    } catch (error) {
      console.error(error);
      toast.error("Save failed!");
    }
  };

  return { generateWebsite };
};

export default useGenerate;
