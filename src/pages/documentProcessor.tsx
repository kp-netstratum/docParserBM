/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";

export const DocumentProcessor = ({ setFileData, Data }: any) => {
  const [file, setFile] = useState<File | null>(null);
  // const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [result, setResult] = useState<any | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // const navigate = useNavigate();
  // const [loading, setLoading] = useState(false);

  // console.log(error, result);

  //   const fetchPackets = async (
  //     page: number = 1,
  //     pageSize: number = 20,
  //     data: any
  //   ) => {
  //     // `http://localhost:8000/upload?page=${page}&page_size=${pageSize}`
  //     const res = await api.post<UploadResponse>(
  //       `/upload?page=${page}&page_size=${pageSize}`,
  //       data,
  //       {
  //         // baseUrl defaults to VITE_API_BASE_URL in the api helper
  //         headers: {}, // do not set Content-Type for FormData
  //       }
  //     );
  //     setResult(res);
  //     onUploaded(res);
  //   };

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setFileData(selected);
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
    const droppedFile = e.dataTransfer.files?.[0] ?? null;
    if (droppedFile) {
      setFile(droppedFile);
      setFileData(droppedFile);
    }
  }

  function handleBrowseClick() {
    inputRef.current?.click();
  }

  function handleRemoveFile() {
    setFile(null);
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

  const helperTextStyle: React.CSSProperties = {
    marginTop: 8,
    fontSize: 12,
    color: "#6b7280",
  };

  function handleCloseError() {
    setError(null);
  }

  return (
    <div className="flex h-full items-center justify-center flex-col gap-4 m-auto relative w-full">
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
      <div
        className={`bg-slate-800 p-6 rounded-lg flex flex-col items-center gap-4 w-full relative z-10 border ${
          file
            ? "border-green-500 shadow-green-500 shadow-lg"
            : "border-slate-700"
        }`}
      >
        <div className="text-center flex flex-col gap-2">
          <div className="text-3xl font-bold">{Data.fileName}</div>
        </div>
        {/* Remove onSubmit from form */}
        <form className="py-4 w-full">
          <div>
            <input
              ref={inputRef}
              type="file"
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
                {file ? (
                  <div className="flex justify-between items-center">
                    <div style={{ fontWeight: 600 }}>{file.name}</div>
                    <div>
                      <div className="flex">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile();
                          }}
                        >
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
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ fontWeight: 600 }}>Drop your file here</div>
                    <div style={helperTextStyle}>or click to browse</div>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* {file && (
            <div className="pt-4 flex">
              <button
                type="button"
                onClick={handleRemoveFile}
                className="px-3 py-2 bg-slate-600 rounded-md text-center cursor-pointer border border-slate-600 hover:border-red-500 hover:bg-slate-800 transition-colors duration-300 ease-in-out"
                aria-label="Remove selected file"
              >
                Remove file
              </button>
            </div>
          )} */}
          {/* <div className="pt-5 flex gap-4">
            <button
              type="button"
              onClick={() => setFile(null)}
              className="px-4 py-2 bg-slate-600 rounded-md w-[100px] text-center cursor-pointer border border-slate-600 hover:border-red-500 hover:bg-slate-800  transition-colors duration-300 ease-in-out"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex justify-center px-4 py-2 bg-gradient-to-l from-violet-500 to-violet-500 rounded-md w-[100px] text-center cursor-pointer hover:bg-gradient-to-lb hover:to-blue-800 hover:from-violet-500 transition-colors  duration-500 ease-in-out "
              disabled={!file || isUploading || loading}
            >
              {isUploading || loading ? (
                <span className="flex items-center gap-2">Analyzing...</span>
              ) : (
                "Analyze"
              )}
            </button>
          </div> */}
        </form>
        {/* Loader below the form */}
        {/* {(isUploading || loading) && (
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
        )} */}
      </div>
      {/* <div className="absolute w-[100px] h-[100px] bg-purple-500 rounded-full blur-[50px] scale-[2] left-0"></div>
      <div className="absolute w-[100px] h-[100px] bg-blue-500 rounded-full blur-[50px] scale-[2] right-0"></div> */}
    </div>
  );
};
