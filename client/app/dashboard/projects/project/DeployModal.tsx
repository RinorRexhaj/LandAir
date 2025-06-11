import useApi from "@/app/hooks/useApi";
import useAuth from "@/app/hooks/useAuth";
import { useProjectStore } from "@/app/store/useProjectsStore";
import { useThemeStore } from "@/app/store/useThemeStore";
import { supabase } from "@/app/utils/Supabase";
import {
  faRocket,
  faSpinner,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

interface DeployModalProps {
  setShowDeployModal: (deploying: boolean) => void;
}

const DeployModal: React.FC<DeployModalProps> = ({ setShowDeployModal }) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [statusMessage, setStatusMessage] = useState<null | {
    type: "success" | "error";
    text: string;
  }>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const { user } = useAuth();
  const { post } = useApi();
  const { darkMode } = useThemeStore();
  const { selectedProject } = useProjectStore();

  const appendLog = (msg: string) => {
    setLogs((prev) => [...prev, msg]);
  };

  const handleDeploy = async () => {
    if (!selectedProject) {
      setStatusMessage({
        type: "error",
        text: "No project selected for deployment.",
      });
      return;
    }

    setIsDeploying(true);
    setStatusMessage(null);
    setLogs([]);

    try {
      appendLog("Initializing deployment...");

      // Create FormData to send files
      const formData = new FormData();

      // Add project files to FormData
      const projectFile = await getProjectFile();
      console.log(projectFile);
      formData.append("file", projectFile);

      appendLog("Uploading project files...");

      const response: VercelDeploymentResponse = await post("/api/deploy", {
        formData,
      });

      if (!response) {
        throw new Error("Deployment failed");
      }

      appendLog("Deployment successful!");

      setStatusMessage({
        type: "success",
        text: "Deployment completed successfully.",
      });
    } catch (err: unknown) {
      console.error(err);
      appendLog(
        `Error: ${
          err instanceof Error ? err.message : "Unknown error occurred"
        }`
      );
      setStatusMessage({
        type: "error",
        text: "Deployment failed. Please try again.",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const getProjectFile = async (): Promise<File> => {
    try {
      // Get the file path from your project data
      const filePath = `${user?.id}/${selectedProject?.project_name}`;

      // Get the public URL of the file
      const { data: urlData } = supabase.storage
        .from("pages")
        .getPublicUrl(filePath);

      if (!urlData.publicUrl) {
        throw new Error("Could not get public URL for the file");
      }

      // Fetch the file content
      const response = await fetch(urlData.publicUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch file from storage");
      }

      // Convert the response to a Blob
      const blob = await response.blob();

      // Create a File object from the Blob
      const file = new File([blob], "index.html", { type: "text/html" });

      return file;
    } catch (error) {
      console.error("Error fetching project files:", error);
      throw error;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className={`p-6 rounded-xl max-w-md w-full mx-4 space-y-4 ${
          darkMode ? "bg-zinc-800" : "bg-white"
        }`}
      >
        <h3
          className={`text-xl font-semibold ${
            darkMode ? "text-white" : "text-zinc-900"
          }`}
        >
          Deploy Project
        </h3>

        <p className={`${darkMode ? "text-gray-300" : "text-zinc-600"}`}>
          Are you ready to deploy &ldquo;
          <span className="font-bold">{selectedProject?.project_name}</span>
          &rdquo;?
        </p>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={confirmation}
              onChange={() => setConfirmation(!confirmation)}
            />
            I understand this will make the project live.
          </label>
        </div>

        <div className="bg-black/10 rounded-md p-2 text-xs h-24 overflow-y-auto whitespace-pre-wrap font-mono">
          {logs.length > 0
            ? logs.join("\n")
            : "Deployment logs will appear here..."}
        </div>

        <div
          className={`${
            statusMessage ? "opacity-100" : "opacity-0"
          } flex items-center gap-2 text-sm font-medium ${
            statusMessage?.type === "success"
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          <FontAwesomeIcon
            icon={
              statusMessage?.type === "success" ? faCheckCircle : faTimesCircle
            }
          />
          {statusMessage?.text}
        </div>

        <div className="flex justify-end gap-4 pt-2">
          <button
            onClick={() => setShowDeployModal(false)}
            className={`px-4 py-2 rounded-lg font-medium ${
              darkMode
                ? "bg-zinc-700 hover:bg-zinc-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-zinc-900"
            }`}
          >
            Cancel
          </button>

          <button
            onClick={handleDeploy}
            disabled={isDeploying || !confirmation}
            className="px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeploying ? (
              <>
                <FontAwesomeIcon
                  icon={faSpinner}
                  className="w-4 h-4 animate-spin"
                />
                Deploying...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faRocket} className="w-4 h-4" />
                Deploy
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeployModal;
