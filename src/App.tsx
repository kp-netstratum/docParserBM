/* eslint-disable @typescript-eslint/no-explicit-any */
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DocumentProcessor } from "./pages/documentProcessor";
import { useState } from "react";
import { Analysis } from "./pages/analysis";
import ChatBot from "./components/test";

function App() {
  const [uploadResult, setUploadResult] = useState<any | null>(null);
  const [fileData, setFileData] = useState<any>(null);

  console.log("App uploadResult:", uploadResult);

  return (
    <div className="h-[100vh] w-[100vw] bg-slate-950 text-white">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <DocumentProcessor
                onUploaded={(res:any) => setUploadResult(res)}
                fileData={fileData}
                setFileData={setFileData}
              />
            }
          />
          <Route
            path="/analysis"
            element={
              <Analysis data={uploadResult ?? null} fileData={fileData} />
            }
          />
        <Route path="/test" element={<ChatBot/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
