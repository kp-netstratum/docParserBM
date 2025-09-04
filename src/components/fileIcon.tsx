import React from "react";

type FileIconProps = {
  name?: string;
  type?: string;
  size?: number;
  className?: string;
};

function getExtension(name?: string): string {
  if (!name) return "";
  const lastDotIndex = name.lastIndexOf(".");
  if (lastDotIndex === -1) return "";
  return name.slice(lastDotIndex + 1).toLowerCase();
}

function getKind(ext: string, type?: string):
  | "pdf"
  | "image"
  | "audio"
  | "video"
  | "word"
  | "excel"
  | "powerpoint"
  | "text"
  | "code"
  | "archive"
  | "csv"
  | "json"
  | "generic" {
  if (type) {
    if (type.startsWith("image/")) return "image";
    if (type.startsWith("audio/")) return "audio";
    if (type.startsWith("video/")) return "video";
    if (type === "application/pdf") return "pdf";
    if (
      type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      type === "application/msword"
    )
      return "word";
    if (
      type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      type === "application/vnd.ms-excel"
    )
      return "excel";
    if (
      type === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
      type === "application/vnd.ms-powerpoint"
    )
      return "powerpoint";
    if (type === "text/plain") return "text";
    if (type === "text/csv") return "csv";
    if (type === "application/json") return "json";
    if (
      type === "application/zip" ||
      type === "application/x-zip-compressed" ||
      type === "application/x-tar" ||
      type === "application/x-7z-compressed"
    )
      return "archive";
  }

  if (["pdf"].includes(ext)) return "pdf";
  if (["png", "jpg", "jpeg", "gif", "bmp", "webp", "svg"].includes(ext)) return "image";
  if (["mp3", "wav", "ogg", "m4a", "flac"].includes(ext)) return "audio";
  if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext)) return "video";
  if (["doc", "docx"].includes(ext)) return "word";
  if (["xls", "xlsx"].includes(ext)) return "excel";
  if (["ppt", "pptx"].includes(ext)) return "powerpoint";
  if (["txt", "md"].includes(ext)) return "text";
  if (["csv"].includes(ext)) return "csv";
  if (["json"].includes(ext)) return "json";
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "archive";
  if (["js", "ts", "tsx", "jsx", "py", "java", "go", "rb", "php", "c", "cpp"].includes(ext))
    return "code";
  return "generic";
}

export const FileIcon: React.FC<FileIconProps> = ({ name, type, size = 18, className }) => {
  const ext = getExtension(name);
  const kind = getKind(ext, type);

  const colorMap: Record<string, string> = {
    pdf: "#EF4444",
    image: "#10B981",
    audio: "#F59E0B",
    video: "#3B82F6",
    word: "#2563EB",
    excel: "#22C55E",
    powerpoint: "#F97316",
    text: "#6B7280",
    csv: "#16A34A",
    json: "#06B6D4",
    code: "#8B5CF6",
    archive: "#D97706",
    generic: "#9CA3AF",
  };

  const stroke = colorMap[kind] || colorMap.generic;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      focusable="false"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      {kind === "pdf" && <path d="M8 15c2 0 2-4 4-4s2 4 4 4" />}
      {kind === "image" && (
        <>
          <circle cx="9" cy="10" r="1" />
          <path d="M21 15l-3-3-4 4-2-2-5 5" />
        </>
      )}
      {kind === "audio" && <path d="M9 17V7l8-2v12" />}
      {kind === "video" && <polygon points="10,8 16,12 10,16" fill={stroke} stroke="none" />}
      {kind === "word" && <path d="M8 16l2-8 2 6 2-6 2 8" />}
      {kind === "excel" && <path d="M8 8l8 8M16 8l-8 8" />}
      {kind === "powerpoint" && <path d="M9 8h3a3 3 0 0 1 0 6H9z" />}
      {kind === "text" && <path d="M8 12h8M8 16h8M8 8h4" />}
      {kind === "csv" && <path d="M8 16c0-4 8-4 8 0" />}
      {kind === "json" && <path d="M8 12c-2 0-2-4 0-4M16 16c2 0 2-4 0-4" />}
      {kind === "code" && (
        <>
          <path d="M10 8l-4 4 4 4" />
          <path d="M14 8l4 4-4 4" />
        </>
      )}
      {kind === "archive" && <path d="M10 6h4M10 10h4M10 14h4M10 18h4" />}
    </svg>
  );
};

export default FileIcon;