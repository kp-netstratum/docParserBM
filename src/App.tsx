/* eslint-disable @typescript-eslint/no-explicit-any */
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store';
import { Analysis } from "./pages/analysis";
import { DashBoard } from "./pages/dashBoard";
import { DocProcessor } from "./components/docProcessor";
import { Admin } from "./pages/admin";
// import AdminFormBuilder from "./pages/adminFormBuilder";

function App() {
  const [uploadResult, setUploadResult] = useState<any | null>(null);
  const [fileDataMain, setFileDataMain] = useState<any>(null);
  // const [docList, setDocList] = useState<any>([]);
  // const [appForm, setAppForm] = useState<any>();

  console.log("App render", uploadResult, fileDataMain);
  

  return (
    <Provider store={store}>
      <PersistGate loading={<div className="h-[100vh] w-[100vw] bg-slate-950 text-white flex items-center justify-center">Loading...</div>} persistor={persistor}>
        <div className="h-[100vh] w-[100vw] bg-slate-950 text-white">
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={<DashBoard/>}
              />
              <Route path="/admin" element={<Admin />} />
              <Route
                path="/docs"
                element={
                  <DocProcessor
                    // FileJson={docList}
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
                    // appForm={appForm}
                  />
                }
              />
            </Routes>
          </BrowserRouter>
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;
