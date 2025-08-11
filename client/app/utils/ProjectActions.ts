import { load } from "cheerio";
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

export function extractTextFromHTML(html: string) {
  const $ = load(html);

  const title = $("title").text().trim();
  const headings = $("h1,h2")
    .map((_, el) => $(el).text().trim())
    .get();
  const paragraphs = $("p")
    .map((_, el) => $(el).text().trim())
    .get();
  const imageAlts = $("img")
    .map((_, el) => $(el).attr("alt")?.trim())
    .get();

  // Filter out empty strings
  const parts = [title, ...headings, ...paragraphs, ...imageAlts].filter(
    Boolean
  );

  // Join into one string
  return parts.join("\n");
}
