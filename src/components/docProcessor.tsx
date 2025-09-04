/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { DocumentProcessor } from "../pages/documentProcessor";
import { useNavigate } from "react-router-dom";

interface StreamingCallback {
  (chunk: any, done: boolean): void;
}

async function handleExecutionStreaming(
  payload: FormData,
  callback: StreamingCallback
): Promise<string> {
  const controller = new AbortController();
  const token = "bm-e0451015-BRWnuVxs8ZZvC9YEvVDZWgKDvMoOUxyD";

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

export const DocProcessor = ({ FileJson, setResult, setFileDataMain }: any) => {
  // const [fileJsonData, setFileJsonData] = useState(FileJson);
  const [fileData, setFileData] = useState<any>(null);
  const [allFiles, setAllFiles] = useState<any>([]);
  const [files, setFiles] = useState<any>([]);

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [result, setResult] = useState<any | null>(null);
  //   const [isDragging, setIsDragging] = useState(false);
  //   const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFiles(FileJson);
    setAllFiles((prev: any[]) => (fileData ? [...prev, fileData] : prev));
  }, [FileJson, fileData]);

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
    // setResult(null);

    try {
      setIsUploading(true);
      const aggregatedResults: any[] = [];
      for (const file of allFiles) {
        const res = await getExecutePipeline("", file);
        console.log("Pipeline result:", res);
        const parsedData = JSON.parse(res["outputNode-1"].raw);
        aggregatedResults.push(parsedData);
      }
      setResult(aggregatedResults);
      setLoading(false);
      setFileDataMain(allFiles)
      navigate("/analysis");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      setLoading(false);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="w-screen flex flex-col gap-10 pt-20 justify-center items-center">
      <div className="flex justify-center w-full text-3xl font-bold">
        Upload all the Documents
      </div>
      <div className="flex flex-wrap w-full justify-center items-center gap-4">
        {files.map((item: any, index: number) => (
          <div key={index} className="w-1/3">
            <DocumentProcessor
              Data={item}
              setResult={() => {}}
              fileData={fileData}
              setFileData={setFileData}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={handleSubmit}
          disabled={loading || isUploading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading || isUploading ? "Processing..." : "Process Files"}
        </button>
        {error && <span className="text-red-600 text-sm">{error}</span>}
      </div>
    </div>
  );
};
