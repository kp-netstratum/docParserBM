/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

interface DocumentInfoProps {
  selectedDocuments: any[];
  data?: any;
}

export const DocumentInfoDisplay: React.FC<DocumentInfoProps> = ({ selectedDocuments, data }) => {
  if (!selectedDocuments || selectedDocuments.length === 0) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4">
        <p>No documents selected</p>
      </div>
    );
  }

  return (
    <div className="mb-6 space-y-4">
      {selectedDocuments.map((doc, index) => (
        <div key={index} className="bg-slate-700 rounded-lg p-4 text-white">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">{doc.fileName}</h3>
            <span className="text-sm bg-slate-600 px-2 py-1 rounded">
              {doc.fileType} {doc.multipleFiles && '(Multiple)'}
            </span>
          </div>
          
          <div className="text-sm text-gray-300 mb-3">
            Form Fields: {doc.formFields?.length || 0}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {doc.formFields?.map((field: any) => (
              <div key={field.id} className="bg-slate-600 p-2 rounded">
                <div className="font-medium">{field.label}</div>
                <div className="text-gray-300">
                  {field.type} {field.required && '(Required)'}
                </div>
                {data && data[field.name] && (
                  <div className="text-green-300 mt-1">
                    Value: {String(data[field.name])}
                  </div>
                )}
              </div>
            )) || []}
          </div>
        </div>
      ))}
    </div>
  );
};