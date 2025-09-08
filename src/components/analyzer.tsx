/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import FormBuilder, {
  type FormFieldDefinition,
} from "../components/FormBuilder";
import { DocumentInfoDisplay } from "./DocumentInfoDisplay";
import { useAppSelector } from "../store/hooks";

export const Analyzer = ({ data, appForm }: any) => {
  const selectedDocuments = useAppSelector(
    (state) => state.form.selectedDocuments
  );

  const initialForm: FormFieldDefinition[] = useMemo(() => {
    // Ensure appForm is an array, if not return empty array
    if (Array.isArray(appForm)) {
      return appForm as FormFieldDefinition[];
    } else if (appForm?.data && Array.isArray(appForm.data)) {
      return appForm.data as FormFieldDefinition[];
    }
    return [];
  }, [appForm]);

  const [formData, setFormData] = useState<FormFieldDefinition[]>(initialForm);

  const mergedData = useMemo(() => {
    if (Array.isArray(data)) {
      return data.reduce(
        (acc: Record<string, unknown>, curr: Record<string, unknown>) => ({
          ...acc,
          ...curr,
        }),
        {}
      );
    }
    return (data ?? {}) as Record<string, unknown>;
  }, [data]);

  useEffect(() => {
    if (initialForm.length > 0) {
      setFormData(initialForm);
    }
  }, [initialForm]);

  useEffect(() => {
    if (Object.keys(mergedData).length > 0) {
      setFormData((prev) =>
        prev.map((item) => {
          const key = item.name as keyof typeof mergedData;
          if (key in mergedData) {
            return { ...item, value: mergedData[key] };
          }
          return item;
        })
      );
    }
  }, [mergedData]);

  console.log("Form data:", formData);
  console.log("Merged data:", mergedData);

  function handleSubmit(values: Record<string, unknown>) {
    console.log("Submitted values", values);
    // navigate or trigger actions as needed
  }

  function handleFormChange(values: Record<string, unknown>) {
    const nextFormData = formData.map((f) => ({
      ...f,
      value: values[f.name] !== undefined ? values[f.name] : f.value,
    }));
    setFormData(nextFormData);
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#0f172a] to-[#1e293b] overflow-auto">
      <div className="w-full max-w-2xl mb-6 text-white flex justify-end">
        <div
          onClick={() => (window.location.href = "/")}
          className="px-4 py-2 rounded-md bg-gray-500 hover:bg-gray-600 cursor-pointer duration-300"
        >
          Back
        </div>
      </div>
      <div className="w-full max-w-2xl rounded-lg p-8 border border-purple-500 shadow-xl bg-[#0a0f1c]/90 backdrop-blur-md overflow-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-400">
            Document Analysis
          </h1>
          <p className="text-gray-400 mt-2">
            Review and verify the extracted information
          </p>
        </div>
        <div className="max-w-3xl w-full mx-auto px-4">
          {/* Show document info */}
          <DocumentInfoDisplay
            selectedDocuments={selectedDocuments}
            data={mergedData}
          />

          {formData.length >= 0 ? (
            <FormBuilder
              fields={formData}
              onChange={handleFormChange}
              onSubmit={handleSubmit}
              submitText="Submit"
            />
          ) : (
            <div className="text-center text-gray-400">
              <p>No form fields available</p>
              <p className="text-sm mt-2">
                Please check your application configuration
              </p>
              {selectedDocuments.length > 0 && (
                <div className="mt-4 text-left">
                  <h4 className="text-white font-semibold mb-2">Debug Info:</h4>
                  <pre className="text-xs bg-slate-800 p-2 rounded overflow-auto">
                    {JSON.stringify(selectedDocuments, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
