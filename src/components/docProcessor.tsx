/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { DocumentProcessor } from "../pages/documentProcessor";
import { useNavigate } from "react-router-dom";
import useApp from "antd/es/app/useApp";
import { useAppSelector } from "../store/hooks";
import { Plus } from "lucide-react";

interface StreamingCallback {
  (chunk: any, done: boolean): void;
}

async function handleExecutionStreaming(
  payload: FormData,
  callback: StreamingCallback
): Promise<string> {
  const controller = new AbortController();
  const token = "bm-4322dd67-uYqfx1Cn7IiK0QQn0h3tTFCh8IX3Qy2o";

  const response = await fetch(
    `https://dev.studio.bluemesh.ai/flow/execution/v3/7b5c4ba3-ac5b-472f-8964-b3eff7ef1b0f?is_live=false`,
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

export const DocProcessor = ({ setResult, setFileDataMain }: any) => {
  // Get current application and related data from Redux
  const currentApplication = useAppSelector(
    (state) => state.form.currentApplication
  );
  const selectedDocuments = useAppSelector(
    (state) => state.form.selectedDocuments
  );
  const mainJson = useAppSelector((state) => state.form.mainJson);

  console.log("Current Application:", currentApplication);
  console.log("Selected Documents:", selectedDocuments);
  console.log("Main JSON:", mainJson);

  const [fileData, setFileData] = useState<any>(null);
  const [allFiles, setAllFiles] = useState<any>([]);
  const [files, setFiles] = useState<any>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Set up files based on current application data
  useEffect(() => {
    if (currentApplication) {
      // Use the application's form fields as the files to process
      setFiles(currentApplication.data || []);
    } else if (selectedDocuments.length > 0) {
      // Fallback to selected documents
      setFiles(selectedDocuments);
    } else {
      // Redirect back to dashboard if no application is selected
      navigate("/");
    }
  }, [currentApplication, selectedDocuments, navigate]);

  // Update allFiles when fileData changes
  useEffect(() => {
    if (fileData) {
      setAllFiles((prev: any[]) => [...prev, fileData]);
    }
  }, [fileData]);

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

    try {
      setIsUploading(true);
      const aggregatedResults: any[] = [];
      for (const file of allFiles) {
        const res = await getExecutePipeline("", file);
        console.log("Pipeline result:", res);
        const parsedData = res.raw;
        console.log("Parsed data:", parsedData, typeof parsedData);
        aggregatedResults.push(parsedData);
        console.log("Aggregated results:", aggregatedResults);
      }
      setLoading(false);
      setResult(aggregatedResults);
      setFileDataMain(allFiles);
      navigate("/analysis");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      setLoading(false);
    } finally {
      setIsUploading(false);
    }
  }

  // Show loading or error state if no application data
  if (!currentApplication && selectedDocuments.length === 0) {
    return (
      <div className="w-screen flex flex-col gap-10 pt-20 justify-center items-center">
        <div className="text-xl text-red-500">No application selected</div>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  console.log("Rendering DocProcessor with files:", files, allFiles);

  return (
    <div className="w-screen flex flex-col gap-10 pt-20 justify-center items-center">
      <div className="flex flex-col items-center gap-2">
        <div className="text-3xl font-bold">Upload all the Documents</div>
        {currentApplication && (
          <div className="text-lg text-gray-600">
            Application: {currentApplication.name}
          </div>
        )}
      </div>

      <div className="flex flex-wrap w-full justify-center items-center gap-4">
        {selectedDocuments.map((item: any, index: number) => (
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
          disabled={loading || isUploading || allFiles.length === 0}
          className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                         text-white px-10 py-5 rounded-md font-bold shadow-2xl hover:shadow-blue-500/25
                         transform hover:scale-105 transition-all duration-300 ease-out
                         flex items-center gap-3 mx-auto overflow-hidden cursor-pointer"
        >
          <div
            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                              translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
          ></div>
          <span className="relative z-10">
            {" "}
            {loading || isUploading ? "Processing..." : "Process Files"}
          </span>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/50 to-purple-400/50 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        </button>
        {/* <button
          onClick={handleSubmit}
          disabled={loading || isUploading || allFiles.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading || isUploading ? "Processing..." : "Process Files"}
        </button> */}
        {error && <span className="text-red-600 text-sm">{error}</span>}
        {allFiles.length === 0 && (
          <span className="text-yellow-600 text-sm">
            Please upload at least one file
          </span>
        )}
      </div>
    </div>
  );
};
