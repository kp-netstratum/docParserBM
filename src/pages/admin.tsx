/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setMainJson } from "../slices/formSlice";
import AdminFormBuilder from "./adminFormBuilder";

export const Admin = () => {
  const [showform, setShowForm] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [applicationData, setApplicationData] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const dispatch = useAppDispatch();
  const mainJson = useAppSelector((s) => s.form.mainJson);
  const [formshow, setFormshow] = useState(false);
  const [selectedData, setSelectedData] = useState<any>();

  console.log(mainJson, "1234567890");

  useEffect(() => {
    if (mainJson && mainJson.length > 0) {
      setApplications(mainJson);
    }
  }, [mainJson]);

  const handleCreateApplication = () => {
    if (name.trim() && description.trim()) {
      const newApplication = {
        name,
        description,
        data: [], // Initialize with empty data array
      };

      const updatedApplications = [...applications, newApplication];
      setApplications(updatedApplications);

      dispatch(setMainJson(updatedApplications));

      // Reset form
      setName("");
      setDescription("");
      setShowForm(false);
    }
  };

  const handleRemoveApplication = (index: number) => {
    const updatedApps = applications.filter((_, i) => i !== index);
    setApplications(updatedApps);
    dispatch(setMainJson(updatedApps));
  };

  return (
    <div className="text-white relative flex items-center flex-col w-[100vw] h-[100vh] bg-slate-900">
      {formshow ? (
        <div className="w-full">
          <div className="flex justify-end mx-10 my-5">
            <button
              onClick={() => setFormshow(false)}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded transition-colors"
            >
              Back
            </button>
          </div>
          <AdminFormBuilder
            selectedForm={selectedData}
            setSelectedForm={setSelectedData}
          />
        </div>
      ) : (
        <div className="w-full flex flex-col justify-center items-center text-white">
          <div className="flex items-center relative justify-between w-full max-w-4xl p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Page</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-2 mb-4 cursor-pointer transition-colors"
              >
                Create New Application
              </button>
              <button
                onClick={() => {
                  window.location.href = "/";
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-2 mb-4 cursor-pointer transition-colors"
              >
                back
              </button>
            </div>
          </div>

          {showform && (
            <div className=" text-white absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center z-50">
              <div className="w-full justify-center max-w-3xl bg-slate-800 p-6 rounded shadow-lg">
                <button
                  onClick={() => setShowForm(false)}
                  className="w-full flex justify-end text-white hover:text-gray-300 text-2xl"
                >
                  &times;
                </button>
                <div>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Application Name"
                    className="w-full p-2 mb-4 text-sm border text-white border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 "
                  />
                  <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    type="text"
                    placeholder="Description"
                    className="w-full p-2 mb-4 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 "
                  />
                  <button
                    onClick={handleCreateApplication}
                    disabled={!name.trim() || !description.trim()}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded mt-2 mb-4 cursor-pointer transition-colors"
                  >
                    Create Application
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="w-full max-w-4xl p-4 overflow-y-auto flex-grow">
            {applications.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <p className="text-lg">No applications created yet.</p>
                <p className="text-sm">
                  Click "Create New Application" to get started.
                </p>
              </div>
            ) : (
              applications.map((app, index) => (
                <div
                  key={index}
                  className="bg-slate-800 rounded-md p-4 mb-4 flex justify-between items-center cursor-pointer hover:bg-slate-700 transition-colors"
                  onClick={() => {
                    setApplicationData([...applicationData, app]);
                    setSelectedData(app);
                    setFormshow(true);
                  }}
                >
                  <div>
                    <h2 className="text-lg font-bold mb-2">{app.name}</h2>
                    <p className="text-sm text-gray-300">{app.description}</p>
                    <p className="text-xs text-blue-300 mt-1">
                      {app.data?.length || 0} documents configured
                    </p>
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent opening form builder when clicking remove
                      handleRemoveApplication(index);
                    }}
                    className="text-red-400 hover:text-red-300 cursor-pointer px-3 py-1 rounded hover:bg-red-500/20 transition-colors"
                  >
                    Remove
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
