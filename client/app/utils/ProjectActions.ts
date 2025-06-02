import { Project } from "../types/Project";

export const handleOpenFullSize = (selectedProject: Project | null) => {
  const blob = new Blob([selectedProject?.file || ""], {
    type: "text/html",
  });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
};

export const handleDownload = (selectedProject: Project | null) => {
  const blob = new Blob([selectedProject?.file || ""], {
    type: "text/html",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${selectedProject?.project_name || "landing"}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
