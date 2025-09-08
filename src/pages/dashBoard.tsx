/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addApplication, setSelectedDocuments, setCurrentApplication } from "../slices/formSlice";
import { KycDocList, KycForm } from "../forms/kycForm";

export const DashBoard = ({ SetDocs, setAppForm }: any) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const applications = useAppSelector((state) => state.form.applications);
  const formBuilderData = useAppSelector((state) => state.form.formBuilderData);

  const handleKycApplication = () => {
    // Create a new KYC application in Redux
    dispatch(addApplication({ 
      name: "KYC Application", 
      description: "Know Your Customer verification process" 
    }));
    
    // Set the selected documents and form data
    dispatch(setSelectedDocuments(KycDocList));
    SetDocs(KycDocList);
    setAppForm(KycForm);
    navigate("/docs");
  };

  const handleCustomApplication = (appData: any) => {
    // Use data from form builder
    dispatch(setCurrentApplication(appData.id));
    dispatch(setSelectedDocuments(appData.formFields || []));
    SetDocs(appData.formFields || []);
    setAppForm(appData);
    navigate("/docs");
  };

  return (
    <div className="flex flex-col gap-20 pt-20">
      <div className="flex flex-col gap-4">
        <div className="flex justify-center w-full text-3xl font-bold">
          Dashboard
        </div>
        <div className="flex justify-center w-full text-lg text-gray-300">
          Choose an application type to get started
        </div>
      </div>
      
      <div className="flex gap-4 w-full justify-center flex-wrap cursor-pointer">
        {/* Default KYC Application */}
        <div
          onClick={handleKycApplication}
          className="w-80 h-40 bg-slate-800 hover:bg-slate-700 rounded-md flex justify-center items-center text-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          <div className="text-center">
            <div className="text-2xl mb-2">📋</div>
            <div>KYC Application</div>
            <div className="text-sm text-gray-400 mt-2">Default verification process</div>
          </div>
        </div>
        
        {/* Custom Applications from Form Builder */}
        {formBuilderData.map((app: any, index: number) => (
          <div
            key={index}
            onClick={() => handleCustomApplication(app)}
            className="w-80 h-40 bg-gradient-to-br from-purple-800 to-blue-800 hover:from-purple-700 hover:to-blue-700 rounded-md flex justify-center items-center text-xl transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">⚙️</div>
              <div>{app.fileName || app.name}</div>
              <div className="text-sm text-gray-300 mt-2">
                {app.formFields?.length || 0} fields
              </div>
            </div>
          </div>
        ))}
        
        {/* Create New Application Button */}
        <div
          onClick={() => navigate("/form")}
          className="w-80 h-40 bg-gradient-to-br from-green-800 to-teal-800 hover:from-green-700 hover:to-teal-700 rounded-md flex justify-center items-center text-xl transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer border-2 border-dashed border-green-600"
        >
          <div className="text-center">
            <div className="text-3xl mb-2">➕</div>
            <div>Create New</div>
            <div className="text-sm text-gray-300 mt-2">Build custom form</div>
          </div>
        </div>
      </div>
      
      {/* Recent Applications Section */}
      {applications.length > 0 && (
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Recent Applications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {applications.slice(-6).map((app: any) => (
              <div key={app.id} className="bg-slate-800 rounded-lg p-4 hover:bg-slate-700 transition-colors">
                <h3 className="text-lg font-semibold">{app.name}</h3>
                <p className="text-gray-400 text-sm">{app.description}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-xs bg-blue-600 px-2 py-1 rounded">
                    {app.data.length} fields
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
