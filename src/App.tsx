/* eslint-disable @typescript-eslint/no-explicit-any */
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import { Analysis } from "./pages/analysis";
import { DashBoard } from "./pages/dashBoard";
import { DocProcessor } from "./components/docProcessor";
import { Admin } from "./pages/admin";
import AdminFormBuilder from "./pages/adminFormBuilder";

function App() {
  const [uploadResult, setUploadResult] = useState<any | null>(null);
  const [fileDataMain, setFileDataMain] = useState<any>(null);
  const [docList, setDocList] = useState<any>([]);
  const [appForm, setAppForm] = useState<any>();

  const [mainJson, setMainJson] = useState<any>(null);

  console.log("Main Json:", mainJson);

  return (
    <div className="h-[100vh] w-[100vw] bg-slate-950 text-white">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<DashBoard SetDocs={setDocList} setAppForm={setAppForm} />}
          />
          <Route path="/admin" element={<Admin formJson={mainJson} setFormJson={setMainJson} />} />
          <Route path="/form" element={<AdminFormBuilder formJson={mainJson} setFormJson={setMainJson} />} />
          <Route
            path="/docs"
            element={
              <DocProcessor
                FileJson={docList}
                setResult={setUploadResult}
                setFileDataMain={setFileDataMain}
              />
            }
          />
          <Route
            path="/analysis"
            element={
              <Analysis
                data={uploadResult ?? null}
                fileData={fileDataMain}
                appForm={appForm}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
