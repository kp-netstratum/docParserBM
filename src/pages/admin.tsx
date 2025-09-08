import { useState } from "react";


export const Admin = ({ formJson, setFormJson }: any) => {
  const [showform, setShowForm] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [applicationData, setApplicationData] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="text-white relative flex items-center flex-col w-screen h-screen bg-slate-900">
      <div className="flex items-center relative justify-between w-full max-w-4xl p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Page</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2 mb-4 cursor-pointer"
        >
          Create New Application
        </button>
      </div>
      {showform && (
        <div className="absolute top-0 left-0 w-full h-full bg-opacity-70 flex items-center justify-center z-50">
          <div className="w-full justify-center max-w-3xl bg-slate-800 p-6 rounded shadow-lg">
            <button
              onClick={() => setShowForm(false)}
              className="w-full flex justify-end"
            >
              &times;
            </button>
            <div>
              <input
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Application Name"
                className="w-full p-2 mb-4 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                onChange={(e) => setDescription(e.target.value)}
                type="text"
                placeholder="Description"
                className="w-full p-2 mb-4 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={() => {
                  setShowForm(false);
                  setApplications([...applications, { name, description }]);
                  setFormJson([...applications, { name, description, data: [] }]);
                }}
                className="bg-green-500 text-white px-4 py-2 rounded mt-2 mb-4 cursor-pointer"
              >
                Create Application
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="w-full max-w-4xl p-4 overflow-y-auto flex-grow">
        {applications.map((app, index) => (
          <div
            key={index}
            className="bg-slate-800 rounded-md p-4 mb-4 flex justify-between items-center cursor-pointer hover:bg-slate-700"
            onClick={() => {
              setApplicationData([...applicationData, app]);
              window.location.href = "/form";
            }}
          >
            <div>
              <h2 className="text-lg font-bold mb-2">{app.name}</h2>
              <p className="text-sm">{app.description}</p>
            </div>
            <div
              onClick={() => {
                const updatedApps = applications.filter((_, i) => i !== index);
                setApplications(updatedApps);
                setFormJson(updatedApps);
              }}
              className="text-red-500 cursor-pointer"
            >
              remove
            </div>
          </div>
        ))}
      </div>
      {/* <AdminFormBuilder /> */}
    </div>
  );
};
