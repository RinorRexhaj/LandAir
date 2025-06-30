import { useThemeStore } from "@/app/store/useThemeStore";
import { useProjectStore } from "@/app/store/useProjectsStore";
import useApi from "@/app/hooks/useApi";
import {
  faSave,
  faCheckCircle,
  faTimesCircle,
  faSpinner,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";

interface SettingsModalProps {
  setShowSettingsModal: (Settingsing: boolean) => void;
}

interface DeploymentStatus {
  status: "deployed" | "not-deployed" | "loading" | "error";
  url?: string;
  lastDeployed?: string;
  customDomain?: string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  setShowSettingsModal,
}) => {
  const { darkMode } = useThemeStore();
  const { selectedProject } = useProjectStore();
  const { post, get } = useApi();

  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus>({
    status: "loading",
  });
  const [customDomain, setCustomDomain] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [domainAvailability, setDomainAvailability] = useState<
    "checking" | "available" | "taken" | "invalid" | null
  >(null);

  // Extract subdomain from URL (e.g., "myproject" from "https://myproject.landair.app")
  const getCurrentSubdomain = (url?: string) => {
    if (!url) return "";
    const match = url.match(/https?:\/\/([^.]+)\.landair\.app/);
    return match ? match[1] : "";
  };

  // Get domain availability status display
  const getDomainStatusDisplay = () => {
    if (
      !customDomain.trim() ||
      customDomain.length < 3 ||
      domainAvailability === null
    )
      return null;

    switch (domainAvailability) {
      case "checking":
        return (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <FontAwesomeIcon
              icon={faSpinner}
              className="w-3 h-3 animate-spin"
            />
            Checking availability...
          </div>
        );
      case "available":
        return (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3" />
            Domain available
          </div>
        );
      case "taken":
        return (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <FontAwesomeIcon icon={faTimesCircle} className="w-3 h-3" />
            Domain already taken
          </div>
        );
      case "invalid":
        return (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <FontAwesomeIcon icon={faTimesCircle} className="w-3 h-3" />
            Invalid domain format
          </div>
        );
      default:
        return null;
    }
  };

  // Debounced domain checking
  useEffect(() => {
    // Check domain availability
    const checkDomainAvailability = async (domain: string) => {
      if (!domain.trim() || domain.length < 3) {
        setDomainAvailability(null);
        return;
      }

      setDomainAvailability("checking");

      try {
        const result = await get(`/api/deploy?subdomain=${domain}`);

        if (result && typeof result === "object" && "available" in result) {
          setDomainAvailability(result.available ? "available" : "taken");
        } else {
          setDomainAvailability("invalid");
        }
      } catch {
        setDomainAvailability("invalid");
      }
    };

    const timeoutId = setTimeout(() => {
      if (customDomain.trim()) {
        // Only check availability if the domain is different from the current project URL
        const currentSubdomain = getCurrentSubdomain(selectedProject?.url);
        if (customDomain !== currentSubdomain) {
          checkDomainAvailability(customDomain);
        } else {
          // If it's the same as current, show as available
          setDomainAvailability("available");
        }
      } else {
        setDomainAvailability(null);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [customDomain, get, selectedProject]);

  useEffect(() => {
    if (selectedProject) {
      const currentSubdomain = getCurrentSubdomain(selectedProject.url);
      setCustomDomain(currentSubdomain);

      if (selectedProject.url) {
        setDeploymentStatus({
          status: "deployed",
          url: selectedProject.url,
          lastDeployed: selectedProject.last_edited?.toString(),
          customDomain: currentSubdomain,
        });
      } else {
        setDeploymentStatus({
          status: "not-deployed",
        });
      }
    }
  }, [selectedProject]);

  const handleSaveSettings = async () => {
    if (!selectedProject || !customDomain.trim()) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      // Validate custom domain format
      const domainRegex = /^[a-z0-9-]+$/;
      if (!domainRegex.test(customDomain)) {
        throw new Error(
          "Custom domain can only contain lowercase letters, numbers, and hyphens"
        );
      }

      if (customDomain.length < 3 || customDomain.length > 63) {
        throw new Error("Custom domain must be between 3 and 63 characters");
      }

      // Check if domain is different from current
      const currentSubdomain = getCurrentSubdomain(selectedProject.url);
      if (customDomain === currentSubdomain) {
        setSaveMessage({
          type: "success",
          text: "No changes to save",
        });
        return;
      }

      // Here you would typically check domain availability
      // For now, we'll assume it's available
      const newUrl = `https://${customDomain}.landair.app`;

      // Update the project with new URL
      const { url }: { url: string } = await post("/api/deploy", {
        project_name: selectedProject.project_name,
        content: selectedProject.file,
        project_id: selectedProject.id,
        new_name: customDomain,
      });

      if (!url) {
        throw new Error("Deployment failed");
      }

      // Update the project store
      const updatedProject = { ...selectedProject, url: newUrl };
      useProjectStore.getState().changeProject(updatedProject);

      setSaveMessage({
        type: "success",
        text: "Settings saved successfully!",
      });

      // Update deployment status
      setDeploymentStatus((prev) => ({
        ...prev,
        url: newUrl,
        customDomain: customDomain,
      }));
    } catch (error) {
      setSaveMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to save settings",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusIcon = () => {
    switch (deploymentStatus.status) {
      case "deployed":
        return (
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="w-4 h-4 text-green-500"
          />
        );
      case "not-deployed":
        return (
          <FontAwesomeIcon
            icon={faTimesCircle}
            className="w-4 h-4 text-gray-400"
          />
        );
      case "loading":
        return (
          <FontAwesomeIcon
            icon={faSpinner}
            className="w-4 h-4 animate-spin text-blue-500"
          />
        );
      case "error":
        return (
          <FontAwesomeIcon
            icon={faTimesCircle}
            className="w-4 h-4 text-red-500"
          />
        );
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (deploymentStatus.status) {
      case "deployed":
        return "Live";
      case "not-deployed":
        return "Not Deployed";
      case "loading":
        return "Loading...";
      case "error":
        return "Error";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className={`absolute inset-0 ${
          darkMode ? "bg-black/50" : "bg-white/5"
        } backdrop-blur-sm`}
        onClick={() => setShowSettingsModal(false)}
      />
      <div
        className={`relative p-6 rounded-xl max-w-md w-full mx-4 space-y-6 ${
          darkMode ? "bg-zinc-800" : "bg-white"
        }`}
      >
        <h3
          className={`text-xl font-semibold ${
            darkMode ? "text-white" : "text-zinc-900"
          }`}
        >
          Project Live Settings
        </h3>

        {/* Deployment Status Section */}
        <div className="space-y-3">
          <h4
            className={`text-sm font-medium ${
              darkMode ? "text-gray-300" : "text-zinc-700"
            }`}
          >
            Deployment Status
          </h4>

          <div
            className={`p-4 rounded-lg border ${
              darkMode
                ? "bg-zinc-700/50 border-zinc-600"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon()}
                <span
                  className={`font-medium ${
                    darkMode ? "text-white" : "text-zinc-900"
                  }`}
                >
                  {getStatusText()}
                </span>
              </div>

              {deploymentStatus.url && (
                <a
                  href={deploymentStatus.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1 text-sm ${
                    darkMode
                      ? "text-blue-400 hover:text-blue-300"
                      : "text-blue-600 hover:text-blue-700"
                  } transition-colors`}
                >
                  <FontAwesomeIcon
                    icon={faExternalLinkAlt}
                    className="w-3 h-3"
                  />
                  Visit
                </a>
              )}
            </div>

            {deploymentStatus.url && (
              <p
                className={`text-sm mt-2 ${
                  darkMode ? "text-gray-400" : "text-zinc-600"
                }`}
              >
                {deploymentStatus.url}
              </p>
            )}

            {deploymentStatus.lastDeployed && (
              <p
                className={`text-xs mt-1 ${
                  darkMode ? "text-gray-500" : "text-zinc-500"
                }`}
              >
                Last deployed:{" "}
                {new Date(deploymentStatus.lastDeployed).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Custom Domain Section */}
        <div className="space-y-3">
          <h4
            className={`text-sm font-medium ${
              darkMode ? "text-gray-300" : "text-zinc-700"
            }`}
          >
            Custom Domain
          </h4>

          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="text"
                value={customDomain}
                onChange={(e) => {
                  const value = e.target.value;
                  setCustomDomain(value.toLowerCase());
                }}
                placeholder="your-project-name"
                className={`flex-1 px-3 py-2 rounded-l-lg border ${
                  darkMode
                    ? "bg-zinc-700 border-zinc-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-zinc-900 placeholder-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              <span
                className={`px-3 py-2 rounded-r-lg border-l-0 border ${
                  darkMode
                    ? "bg-zinc-600 border-zinc-600 text-gray-300"
                    : "bg-gray-100 border-gray-300 text-zinc-600"
                }`}
              >
                .landair.app
              </span>
            </div>

            <p
              className={`text-xs ${
                darkMode ? "text-gray-400" : "text-zinc-500"
              }`}
            >
              Only lowercase letters, numbers, and hyphens allowed. 3-63
              characters.
            </p>
          </div>
        </div>

        {/* Domain Availability Status */}
        {getDomainStatusDisplay()}

        {/* Save Message */}
        {saveMessage && (
          <div
            className={`flex items-center gap-2 text-sm font-medium ${
              saveMessage.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            <FontAwesomeIcon
              icon={
                saveMessage.type === "success" ? faCheckCircle : faTimesCircle
              }
              className="w-4 h-4"
            />
            {saveMessage.text}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-2">
          <button
            onClick={() => setShowSettingsModal(false)}
            className={`px-4 py-2 rounded-lg font-medium ${
              darkMode
                ? "bg-zinc-700 hover:bg-zinc-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-zinc-900"
            }`}
          >
            Cancel
          </button>

          <button
            onClick={handleSaveSettings}
            disabled={
              isSaving ||
              !customDomain.trim() ||
              domainAvailability === "taken" ||
              domainAvailability === "invalid" ||
              domainAvailability === "checking"
            }
            title={
              !customDomain.trim()
                ? "Please enter a custom domain"
                : domainAvailability === "taken"
                ? "Domain is already taken"
                : domainAvailability === "invalid"
                ? "Invalid domain format"
                : domainAvailability === "checking"
                ? "Checking domain availability"
                : "Save Changes"
            }
            className="px-4 py-2 rounded-lg md:rounded font-medium bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <FontAwesomeIcon
                  icon={faSpinner}
                  className="w-4 h-4 animate-spin"
                />
                Saving...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
