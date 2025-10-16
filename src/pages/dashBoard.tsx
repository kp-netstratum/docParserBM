/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addApplication,
  setSelectedDocuments,
  setCurrentApplication,
} from "../slices/formSlice";
import { useState } from "react";

export const DashBoard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const applications = useAppSelector((state) => state.form.applications);
  const formBuilderData = useAppSelector((state) => state.form.formBuilderData);
  const mainJson = useAppSelector((state) => state.form.mainJson);
  const [applicationsList, setApplicationsList] = useState<any[]>([]);

  const handleCustomApplication = (appData: any) => {
    console.log("Custom Application Data:", appData);

    // First, create a proper application object and add it to applications array
    const applicationPayload = {
      name: appData.fileName || appData.name || "Custom Application",
      description: appData.description || "Custom form application",
    };

    // Add the application to the applications array
    dispatch(addApplication(applicationPayload));

    // The addApplication reducer automatically sets the newly created app as currentApplication
    // So we don't need to call setCurrentApplication separately

    // Set selected documents
    dispatch(setSelectedDocuments(appData.formFields || appData.data || []));

    // Navigate to docs page
    navigate("/docs");
  };

  return (
    <div className="flex flex-col gap-20 pt-20">
      <div className="flex w-full justify-between px-96">
        <div className="flex flex-col items-start justify-start gap-4">
          <div className="flex justify-center text-3xl font-bold">
            Dashboard
          </div>
          <div className="flex justify-center text-lg text-gray-300">
            Choose an application type to get started
          </div>
        </div>
        <div
        onClick={()=>{navigate('/admin')}} 
        className="py-2 px-4 bg-slate-700 rounded-md h-10 flex justify-center items-center cursor-pointer">
          Admin
        </div>
      </div>

      <div className="flex gap-4 w-full justify-center flex-wrap cursor-pointer">
        {/* Custom Applications from Form Builder */}
        {mainJson.map((app: any, index: number) => (
          <div
            key={index}
            onClick={() => handleCustomApplication(app)}
            className="w-80 h-40 bg-gradient-to-br from-purple-800 to-blue-800 hover:from-purple-700 hover:to-blue-700 rounded-md flex justify-center items-center text-xl transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">⚙️</div>
              <div>{app.fileName || app.name}</div>
              <div className="text-sm text-gray-300 mt-2">
                {app.formFields?.length || app.data?.length || 0} fields
              </div>
            </div>
          </div>
        ))}

        {/* Existing Applications
        {applications.map((app: any, index: number) => (
          <div
            key={`existing-${index}`}
            onClick={() => {
              dispatch(setCurrentApplication(app.id));
              navigate("/docs");
            }}
            className="w-80 h-40 bg-gradient-to-br from-blue-800 to-indigo-800 hover:from-blue-700 hover:to-indigo-700 rounded-md flex justify-center items-center text-xl transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">📋</div>
              <div>{app.name}</div>
              <div className="text-sm text-gray-300 mt-2">
                {app.data?.length || 0} fields
              </div>
            </div>
          </div>
        ))} */}
      </div>
    </div>
  );
};
