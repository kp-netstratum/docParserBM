import { useState } from "react";

interface AnalysisProps {
  data: {
    surname?: string;
    givenName?: string;
    age?: number;
    dateOfBirth?: string;
    placeOfBirth?: string;
    passportNumber?: string;
    issueDate?: string;
    expiryDate?: string;
    issuingCountry?: string;
    sex?: string;
    type?: string;
    code?: string;
  };
}

export const Analyzer = ({ data }: AnalysisProps) => {
  const [formData, setFormData] = useState(data);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Surname */}
          <div>
            <label>Surname</label>
            <input
              type="text"
              placeholder="Surname"
              value={formData.surname || ""}
              onChange={(e) => handleInputChange("surname", e.target.value)}
              className="w-full px-4 py-1.5 rounded-md bg-[#111827] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label>Given Name</label>
            {/* Given Name */}
            <input
              type="text"
              placeholder="Given Name"
              value={formData.givenName || ""}
              onChange={(e) => handleInputChange("givenName", e.target.value)}
              className="w-full px-4 py-1.5 rounded-md bg-[#111827] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Age */}
          <div>
            <label>Age</label>
            <input
              type="text"
              placeholder="Age"
              value={formData.age ?? ""}
              onChange={(e) => handleInputChange("age", Number(e.target.value))}
              className="w-full px-4 py-1.5 rounded-md bg-[#111827] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label>Date of Birth</label>
            <input
              type="date"
              placeholder="Date of Birth"
              value={formData.dateOfBirth || ""}
              onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
              className="w-full px-4 py-1.5 rounded-md bg-[#111827] text-gray-300 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Place of Birth */}
          <div>
            <label>Place of Birth</label>
            <input
              type="text"
              placeholder="Place of Birth"
              value={formData.placeOfBirth || ""}
              onChange={(e) =>
                handleInputChange("placeOfBirth", e.target.value)
              }
              className="w-full px-4 py-1.5 rounded-md bg-[#111827] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Passport Number */}
          <div>
            <label>Passport Number</label>
            <input
              type="text"
              placeholder="Passport Number"
              value={formData.passportNumber || ""}
              onChange={(e) =>
                handleInputChange("passportNumber", e.target.value)
              }
              className="w-full px-4 py-1.5 rounded-md bg-[#111827] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Issue Date */}
          <div>
            <label>Issue Date</label>
            <input
              type="date"
              placeholder="Issue Date"
              value={formData.issueDate || ""}
              onChange={(e) => handleInputChange("issueDate", e.target.value)}
              className="w-full px-4 py-1.5 rounded-md bg-[#111827] text-gray-300 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label>Expiry Date</label>
            <input
              type="date"
              placeholder="Expiry Date"
              value={formData.expiryDate || ""}
              onChange={(e) => handleInputChange("expiryDate", e.target.value)}
              className="w-full px-4 py-1.5 rounded-md bg-[#111827] text-gray-300 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Issuing Country */}
          <div>
            <label>Issuing Country</label>
            <input
              type="text"
              placeholder="Issuing Country"
              value={formData.issuingCountry || ""}
              onChange={(e) =>
                handleInputChange("issuingCountry", e.target.value)
              }
              className="w-full px-4 py-1.5 rounded-md bg-[#111827] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </form>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            className="w-full py-1.5 rounded-md bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold shadow-md hover:opacity-90 transition"
          >
            Submit Document
          </button>
        </div>
      </div>
    </div>
  );
};
