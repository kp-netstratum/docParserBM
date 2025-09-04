/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
// import FormBuilder from "./FormBuilder";
import FormBuilder, { type FormFieldDefinition } from "../components/FormBuilder";


// interface AnalysisProps {
//   data: {
//     surname?: string;
//     givenName?: string;
//     age?: number;
//     dateOfBirth?: string;
//     placeOfBirth?: string;
//     passportNumber?: string;
//     issueDate?: string;
//     expiryDate?: string;
//     issuingCountry?: string;
//     sex?: string;
//     type?: string;
//     code?: string;
//   };
//   appForm?: any;
// }

export const Analyzer = ({ data, appForm }: any) => {
  // const [formData, setFormData] = useState(data);

  const initialForm: FormFieldDefinition[] = useMemo(
    () => appForm as unknown as FormFieldDefinition[],
    [appForm]
  );

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
    setFormData((prev) =>
      prev.map((item) => {
        const key = item.name as keyof typeof mergedData;
        if (key in mergedData) {
          return { ...item, value: mergedData[key] };
        }
        return item;
      })
    );
  }, [mergedData])

  console.log(formData, data)

  function handleSubmit(values: Record<string, unknown>) {
    console.log("Submitted values", values);
    // navigate or trigger actions as needed
  }

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log("Form submitted:", formData);
  // };

  // const handleInputChange = (field: string, value: string | number) => {
  //   setFormData((prev) => ({ ...prev, [field]: value }));
  // };

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
          <FormBuilder
            fields={formData}
            onChange={(vals) => {
              const next = formData.map((f) => ({ ...f, value: vals[f.name] }));
              setFormData(next);
            }}
            onSubmit={handleSubmit}
            submitText="Submit"
          />
        </div>
      </div>
    </div>
  );
};
