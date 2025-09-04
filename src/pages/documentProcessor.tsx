/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from "react";
import FileIcon from "../components/fileIcon";
import { useNavigate } from "react-router-dom";

interface StreamingCallback {
  (chunk: any, done: boolean): void;
}

async function handleExecutionStreaming(
  payload: FormData,
  callback: StreamingCallback
): Promise<string> {
  const controller = new AbortController();
  const token =
    "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJIYmRlWmJDbS1DVGthZ2N5SnRvZVhZd2hJTS1OcW5ld0RKQWhvNjg4ZEJVIn0.eyJleHAiOjE3NTcxNDczODAsImlhdCI6MTc1Njg4ODE4MCwianRpIjoiMGEyZTM2YjQtYjk2NC00MmYwLWE3ZDktODU4ODM0ZTIxMWUyIiwiaXNzIjoiaHR0cHM6Ly91czEtZGV2LW5leGEua2FuaW1hbmdvLmNvbS9hdXRoL3JlYWxtcy9ibHVlbWVzaCIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiIxYzA3NTkyOS01ZWNiLTRjMDQtOTc4MC1lZTlmODg4MDFmZWUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJibHVlbWVzaCIsInNlc3Npb25fc3RhdGUiOiJhMWI3YzhmZi01ZWQyLTRiMDUtYTIyZS1kNWY1M2IyN2M5N2IiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIioiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtYmx1ZW1lc2giLCJvZmZsaW5lX2FjY2VzcyIsInN1cGVyYWRtaW4iLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsInNpZCI6ImExYjdjOGZmLTVlZDItNGIwNS1hMjJlLWQ1ZjUzYjI3Yzk3YiIsInRlbmFudF9pZCI6Ijg2NzBjZTQ3LWJlYWQtNDg2My04MWM4LTVlNTFmZTg0NGM3NyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJ0ZWxjb19pZCI6IjNjOTZmZTJhLTkwODgtNDg1MC05MGQzLWU4YTlkOTllYTQ4ZSIsIm5hbWUiOiJWaXNobnUgVCBBc29rIiwicHJlZmVycmVkX3VzZXJuYW1lIjoidmlzaG51dGFzb2tAZ21haWwuY29tIiwiZ2l2ZW5fbmFtZSI6IlZpc2hudSIsImZhbWlseV9uYW1lIjoiVCBBc29rIiwiZW1haWwiOiJ2aXNobnV0YXNva0BnbWFpbC5jb20ifQ.V4FyorVDcjbtlKfYETTwtYyKVTfvwdISLtOtTmuJaSlFj4bzvpXW5K-gcXFv9VOZ12CM1BIoyrchSQ_FqK0OVR4hXQqn3ADV43mRDVN6fl54SlZ1kiotqsbvCL9NzEhUH4ZB5_AAqDhdaYiOtbP0uROsRE5v4qO6A71PAdd3eXpVKeIijMD_iqhpehNf0guAek8aZ63LFgKOdBPcvZZtH3eAcJX7ibEgqD_1WIuySFs6B_wpgb37_f90XDMH7CMF8e742ZCSZAKi7cngOiBM-35kw-uKSmu5sgQ-_LwQZNEq6UCUzC8v8f4hziAwo_68D0KInS-PiocRmTcuiVbWig";

  const response = await fetch(
    `https://dev.studio.bluemesh.ai/flow/execution/v3/d184cffc-60f4-45b1-8df1-4b899833ef5a`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: payload,
      signal: controller.signal,
    }
  );

  if (!response.body) throw new Error("No response body");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let resultText = "";

  async function readStream(): Promise<string> {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        if (buffer.trim()) {
          try {
            const finalJson = JSON.parse(buffer.trim());
            resultText += finalJson?.content || "";
            callback(finalJson, true);
          } catch (e) {
            console.error("Final buffer parse error:", buffer, e);
          }
        } else {
          callback(null, true);
        }
        return resultText;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        try {
          const parsed = JSON.parse(trimmed);
          resultText += parsed?.content || "";
          callback(parsed, false);
        } catch (error: any) {
          console.error("Error parsing JSON line:", error);
          console.error("Partial/invalid JSON line (skip):", trimmed);
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  return readStream();
}

export const DocumentProcessor = ({ onUploaded, setFileData }: any) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // console.log("Files:", files);

  const getExecutePipeline = async (
    textInput: string,
    fileInput: Blob | File | null = null
  ) => {
    const formData = new FormData();

    // Handle file input (audio blob or file)
    if (fileInput) {
      formData.append("file", fileInput);
    }

    // Always include text input in the payload
    const Payload = {
      input: textInput, // Always send text input
      chatHistory: [],
    };
    formData.append("payload", JSON.stringify(Payload));

    console.log("FormData payload:", formData);

    return new Promise<any>((resolve, reject) => {
      let lastChunk: any = null;

      handleExecutionStreaming(formData, (chunk: any, done: any) => {
        if (chunk) {
          lastChunk = chunk;

          console.log("CHUNKKK", lastChunk);
        }

        if (done && lastChunk) {
          console.log("DONEEE", lastChunk);
          resolve(lastChunk);
        }
      }).catch((error) => {
        console.error("Streaming failed:", error);
        reject(error);
      });
    });
  };

  // Remove handleSubmit from form, use it as a button click handler instead
  async function handleSubmit() {
    if (loading || isUploading) return; // Prevent multiple submissions
    setLoading(true);
    setError(null);
    if (files.length === 0) return;
    setFileData(files);
    try {
      setIsUploading(true);

      // Process each file
      const results = [];
      for (const file of files) {
        const result = await getExecutePipeline("", file);
        console.log("Pipeline result for", file.name, ":", result);
        const parsedData = JSON.parse(result["outputNode-1"].raw);
        results.push({ fileName: file.name, data: parsedData });
      }

      // Send all results to parent component
      onUploaded(results);
      setLoading(false);
      navigate("/analysis");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      setLoading(false);
    } finally {
      setIsUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files || []);
    if (droppedFiles.length > 0) setFiles(droppedFiles);
  }

  function handleBrowseClick() {
    inputRef.current?.click();
  }

  function handleRemoveFile(fileToRemove: File) {
    setFiles(files.filter((file) => file !== fileToRemove));
  }

  const dropzoneStyle: React.CSSProperties = {
    position: "relative",
    background: isDragging ? "bfefff" : "#f9fafb",
    color: "#374151",
    borderRadius: 12,
    padding: 28,
    textAlign: "center" as const,
    transition: "all 0.15s ease-in-out",
    cursor: "pointer",
  };

  function handleCloseError() {
    setError(null);
  }

  return (
    <div className="flex h-full w-full items-center justify-center flex-col gap-4 max-w-[800px] m-auto relative">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 w-full flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={handleCloseError}
            className="ml-4 px-2 py-1 bg-red-400 text-white rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      )}
      <div className="bg-slate-800 p-6 rounded-lg flex flex-col items-center gap-4 w-full relative z-10 border border-slate-700">
        <div className="text-center flex flex-col gap-2">
          <div className="text-3xl font-bold">Abhi - KYC Application</div>
          <p className="text-sm">
            Drag and drop your documents here, or click to browse
          </p>
        </div>
        {/* Remove onSubmit from form */}
        <form className="py-4 w-full">
          <div>
            <input
              ref={inputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <div
              onClick={handleBrowseClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={dropzoneStyle}
            >
              <div>
                {files.length > 0 ? (
                  <>
                    <div style={{ fontWeight: 600 }}>
                      {files.length === 1
                        ? files[0].name
                        : `${files.length} files selected`}
                    </div>
                    <div>
                      {files.length === 1
                        ? "Ready to upload"
                        : "Ready to upload all files"}
                    </div>
                    {files.length > 0 && (
                      <div className="flex flex-col gap-1 pt-5">
                        {files.map((file, index) => (
                          <div
                            key={index}
                            className="text-sm bg-slate-300 p-2 rounded-md text-black flex justify-between items-center"
                          >
                            <div className="text-sm flex justify-start items-center gap-2">
                              <FileIcon name={file.name} type={file.type} />
                              <span>{file.name}</span>
                            </div>
                            <div onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFile(file);
                            }}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#fb4646"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="lucide lucide-x-icon lucide-x"
                              >
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                              </svg>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div style={{ fontWeight: 600 }}>Drop your files here</div>
                    <div className="text-sm">or click to browse</div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="pt-5 flex gap-4">
            <button
              type="button"
              onClick={() => setFiles([])}
              className="px-4 py-2 bg-slate-600 rounded-md w-[100px] text-center cursor-pointer border border-slate-600 hover:border-red-500 hover:bg-slate-800  transition-colors duration-300 ease-in-out"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex justify-center px-4 py-2 bg-gradient-to-l from-violet-500 to-violet-500 rounded-md w-[100px] text-center cursor-pointer hover:bg-gradient-to-lb hover:to-blue-800 hover:from-violet-500 transition-colors  duration-500 ease-in-out "
              disabled={files.length === 0 || isUploading || loading}
            >
              {isUploading || loading ? (
                <span className="flex items-center gap-2">Analyzing...</span>
              ) : (
                "Analyze"
              )}
            </button>
          </div>
        </form>
        {/* Loader below the form */}
        {(isUploading || loading) && (
          <div className="flex justify-center items-center mt-4">
            <svg
              className="animate-spin h-8 w-8 text-violet-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
            <span className="ml-2 text-violet-500">Processing...</span>
          </div>
        )}
      </div>
      <div className="absolute w-[100px] h-[100px] bg-purple-500 rounded-full blur-[50px] scale-[2] left-0"></div>
      <div className="absolute w-[100px] h-[100px] bg-blue-500 rounded-full blur-[50px] scale-[2] right-0"></div>
    </div>
  );
};
