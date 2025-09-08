/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { updateApplication } from "../slices/formSlice";
import { Preview } from "../components/preview";
import FileIcon from "../components/fileIcon";
import { Analyzer } from "../components/analyzer";

export const Analysis = ({ data, fileData, appForm }: any) => {
  const dispatch = useAppDispatch();
  const currentApplication = useAppSelector((state) => state.form.currentApplication);
  const selectedDocuments = useAppSelector((state) => state.form.selectedDocuments);
  
  const [openModal, setOpenModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  // Save analysis results to Redux when available
  useEffect(() => {
    if (data && currentApplication) {
      setAnalysisResults(data);
      // Optionally update the application with analysis results
      // dispatch(updateApplication({ id: currentApplication.id, data: analysisData }));
    }
  }, [data, currentApplication, dispatch]);

  // Handle escape key to close modal
  console.log("data", data?.[0]?.fileName, fileData);
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && openModal) {
        setOpenModal(false);
        setSelectedFile(null);
      }
    };

    if (openModal) {
      document.addEventListener("keydown", handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [openModal]);

  const closeModal = () => {
    setOpenModal(false);
    setSelectedFile(null);
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };
  const displayData = data || analysisResults;
  const displayForm = appForm || currentApplication;
  
  return displayData ? (
    <div className=" space-y-10 flex h-[100vh] sm:flex-row flex-col bg-gradient-to-br from-[#0f172a] to-[#1e293b] overflow-auto">
      {/* Application Info Header */}
      {displayForm && (
        <div className="absolute top-4 left-4 bg-slate-800 rounded-lg p-3 shadow-lg z-10">
          <h3 className="text-white font-semibold">{displayForm.name || displayForm.fileName}</h3>
          <p className="text-gray-300 text-sm">{displayForm.description || 'Custom Application'}</p>
        </div>
      )}
      
      <div className="w-1/2 flex items-center justify-center h-full m-0 gap-4 flex-wrap">
        {/* <Preview fileData={fileData} /> */}
        {fileData?.map((file: any) => (
          <div
            onClick={() => {
              setOpenModal(true);
              setSelectedFile(file);
            }}
            key={file.fileName}
            className="text-white bg-slate-700 hover:bg-slate-600 p-4 rounded-md flex w-48 items-center gap-2 transition-colors cursor-pointer shadow-lg hover:shadow-xl"
          >
            <FileIcon name={file.name} type={file.type} size={30}/>
            <span className="truncate">{file.name}</span>
          </div>
        )) || []}
        {openModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={handleBackdropClick}
          >
            <div className="relative bg-white rounded-lg shadow-xl max-w-6xl max-h-[90vh] w-[95vw] h-[90vh] overflow-hidden">
              {/* Close button */}
              <div onClick={closeModal} className="flex justify-end px-4 py-2">
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
              <Preview fileData={selectedFile} />
            </div>
          </div>
        )}
      </div>
      <div className="w-1/2">
        <Analyzer appForm={displayForm} data={displayData} />
      </div>
    </div>
  ) : (
    <div className="h-full flex flex-col gap-3 items-center justify-center p-6 bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
      <h2 className="text-2xl font-bold text-center text-white">
        No analysis data available.
      </h2>
      <div
        onClick={() => (window.location.href = "/")}
        className="text-white cursor-pointer bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
      >
        Home
      </div>
    </div>
  );
};
