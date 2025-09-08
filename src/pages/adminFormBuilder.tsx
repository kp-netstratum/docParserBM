/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { 
  setMainJson, 
  setFormBuilderData, 
  addFormBuilderDocument, 
  updateFormBuilderDocument, 
  removeFormBuilderDocument 
} from "../slices/formSlice";
 
import {
  Plus,
  X,
  Copy,
  Download,
  FileText,
  CreditCard,
  GripVertical,
  Sparkles,
  Move,
} from "lucide-react";

// Type definitions
interface FormField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  value: string;
  placeHolder: string;
  label: string;
}

interface Document {
  fileName: string;
  fileType: string;
  multipleFiles: boolean;
  formFields: FormField[];
}

interface FieldType {
  id: string;
  type: string;
  label: string;
  icon: string;
}

interface DocumentType {
  value: string;
  label: string;
  icon: any;
}

// Field Component
interface FieldProps {
  field: FormField;
  fieldIndex: number;
  onUpdate: (
    fieldIndex: number,
    property: keyof FormField,
    value: string | boolean
  ) => void;
  onRemove: (fieldIndex: number) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const Field: React.FC<FieldProps> = ({
  field,
  fieldIndex,
  onUpdate,
  onRemove,
}) => {
  const handleFieldChange = (property: keyof FormField) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = property === "required" ? e.target.checked : e.target.value;
      onUpdate(fieldIndex, property, value);
    };
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        {/* Drag handle on the left */}
        <div className="flex flex-col justify-center items-center mr-2 cursor-move text-gray-400 hover:text-gray-600">
          <GripVertical className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-3">
          <label className="block text-sm font-bold text-gray-600">
            {field.label}
          </label>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Name
              </label>
              <input
                type="text"
                value={field.name}
                onChange={handleFieldChange("name")}
                className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Label
              </label>
              <input
                type="text"
                value={field.label}
                onChange={handleFieldChange("label")}
                className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Placeholder
              </label>
              <input
                type="text"
                value={field.placeHolder}
                onChange={handleFieldChange("placeHolder")}
                className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Default Value
              </label>
              <input
                type="text"
                value={field.value}
                onChange={handleFieldChange("value")}
                className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-4 mt-5">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={handleFieldChange("required")}
                  className="rounded"
                />
                <span className="text-sm">Required</span>
              </label>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <button
            onClick={() => onRemove(fieldIndex)}
            className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
            aria-label={`Remove ${field.label} field`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminFormBuilder: React.FC = ({selectedForm, setSelectedForm}:any) => {
  const dispatch = useAppDispatch();
  const formJson = useAppSelector((s) => s.form.mainJson);
  const formBuilderData = useAppSelector((s) => s.form.formBuilderData);

  const [documents, setDocuments] = useState<Document[]>([]);
  const [showDocumentModal, setShowDocumentModal] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<number | null>(null);
  const [showFieldBuilder, setShowFieldBuilder] = useState<boolean>(false);
  const [draggedFieldIndex, setDraggedFieldIndex] = useState<number | null>(
    null
  );
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  // Field types available
  const fieldTypes: FieldType[] = [
    { id: "text-field", type: "text", label: "Text Field", icon: "📝" },
    { id: "email-field", type: "email", label: "Email Field", icon: "📧" },
    { id: "date-field", type: "date", label: "Date Field", icon: "📅" },
    { id: "number-field", type: "number", label: "Number Field", icon: "🔢" },
    { id: "tel-field", type: "tel", label: "Phone Field", icon: "📞" },
    { id: "select-field", type: "select", label: "Dropdown", icon: "📋" },
    { id: "textarea-field", type: "textarea", label: "Text Area", icon: "📄" },
    { id: "checkbox-field", type: "checkbox", label: "Checkbox", icon: "☑️" },
    { id: "radio-field", type: "radio", label: "Radio Button", icon: "🔘" },
  ];

  // Document type options
  const documentTypes: DocumentType[] = [
    { value: "passport", label: "Passport", icon: FileText },
    { value: "id_card", label: "ID Card", icon: CreditCard },
    { value: "driver_license", label: "Driver License", icon: CreditCard },
    { value: "utility_bill", label: "Utility Bill", icon: FileText },
    { value: "bank_statement", label: "Bank Statement", icon: FileText },
    { value: "other", label: "Other Document", icon: FileText },
  ];

  const [newDocument, setNewDocument] = useState<Document>({
    fileName: "",
    fileType: "any",
    multipleFiles: false,
    formFields: [],
  });

  // const [JsonOutput, setJsonOutput] = useState<any>([]);

  // useEffect(() => {
  //   setJsonOutput(formJson);
  // }, [formJson]);

  // Sync local documents state with Redux on mount
  // useEffect(() => {
  //   if (formBuilderData.length > 0) {
  //     setDocuments(formBuilderData);
  //   }
  // }, [formBuilderData]);

  console.log(formJson, formBuilderData, formBuilderData, selectedForm, '1234567890')

  const addDocument = (): void => {
    if (newDocument.fileName.trim()) {
      const updatedDocuments = [...documents, { ...newDocument }];
      setDocuments(updatedDocuments);
      
      // Dispatch to Redux for persistence
      // dispatch(addFormBuilderDocument({ ...newDocument }));
      // dispatch(setMainJson([...(formJson ?? []), { ...newDocument }] as any));
      
      setNewDocument({
        fileName: "",
        fileType: "any",
        multipleFiles: false,
        formFields: [],
      });
      setShowDocumentModal(false);
    }
  };

  const removeDocument = (index: number): void => {
    const updated = documents.filter((_, i) => i !== index);
    setDocuments(updated);
    
    // Dispatch to Redux for persistence
    dispatch(removeFormBuilderDocument(index));
    dispatch(setMainJson(updated as any));
  };

  const openFieldBuilder = (docIndex: number): void => {
    setSelectedDocument(docIndex);
    setShowFieldBuilder(true);
  };

  const addField = (fieldType: FieldType): void => {
    if (selectedDocument === null) return;

    const newField: FormField = {
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `field_${Date.now()}`,
      type: fieldType.type,
      required: true,
      value: "",
      placeHolder: `Enter ${fieldType.label.replace(" Field", "")}`,
      label: fieldType.label.replace(" Field", ""),
    };

    const updatedDocuments = [...documents];
    updatedDocuments[selectedDocument].formFields.push(newField);
    setDocuments(updatedDocuments);
    
    // Dispatch to Redux for persistence
    dispatch(updateFormBuilderDocument({ 
      index: selectedDocument, 
      data: updatedDocuments[selectedDocument] 
    }));
  };

  const updateField = (
    fieldIndex: number,
    property: keyof FormField,
    value: string | boolean
  ): void => {
    if (selectedDocument === null) return;

    const updatedDocuments = [...documents];
    (updatedDocuments[selectedDocument].formFields[fieldIndex] as any)[
      property
    ] = value;
    setDocuments(updatedDocuments);
    
    // Dispatch to Redux for persistence
    dispatch(updateFormBuilderDocument({ 
      index: selectedDocument, 
      data: updatedDocuments[selectedDocument] 
    }));
  };

  const removeField = (fieldIndex: number): void => {
    if (selectedDocument === null) return;

    const updatedDocuments = [...documents];
    updatedDocuments[selectedDocument].formFields.splice(fieldIndex, 1);
    setDocuments(updatedDocuments);
    
    // Dispatch to Redux for persistence
    dispatch(updateFormBuilderDocument({ 
      index: selectedDocument, 
      data: updatedDocuments[selectedDocument] 
    }));
  };

  // Move field up
  const moveFieldUp = (fieldIndex: number): void => {
    if (selectedDocument === null || fieldIndex === 0) return;
    const updatedDocuments = [...documents];
    const fields = updatedDocuments[selectedDocument].formFields;
    [fields[fieldIndex - 1], fields[fieldIndex]] = [
      fields[fieldIndex],
      fields[fieldIndex - 1],
    ];
    setDocuments(updatedDocuments);
  };

  // Move field down
  const moveFieldDown = (fieldIndex: number): void => {
    if (selectedDocument === null) return;
    const fields = documents[selectedDocument].formFields;
    if (fieldIndex >= fields.length - 1) return;
    const updatedDocuments = [...documents];
    [
      updatedDocuments[selectedDocument].formFields[fieldIndex],
      updatedDocuments[selectedDocument].formFields[fieldIndex + 1],
    ] = [
      updatedDocuments[selectedDocument].formFields[fieldIndex + 1],
      updatedDocuments[selectedDocument].formFields[fieldIndex],
    ];
    setDocuments(updatedDocuments);
  };

  const generateJSON = (): string => {
    // Remove id property from formFields for clean output
    const cleanDocuments = documents.map((doc) => ({
      ...doc,
      formFields: doc.formFields.map((field) =>
        Object.fromEntries(
          Object.entries(field).filter(([key]) => key !== "id")
        ) as Omit<FormField, "id">
      ),
    }));
    const data = selectedForm
    data.data = cleanDocuments
    console.log(data, '22222222222222')
    setSelectedForm(data)
    return JSON.stringify(cleanDocuments, null, 2);
  };

  const copyToClipboard = async (): Promise<void> => {
    const jsonOutput = `export const Kyc = ${generateJSON()};`;
    try {
      await navigator.clipboard.writeText(jsonOutput);
      alert("JSON copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      alert("Failed to copy to clipboard. Please try again.");
    }
  };

  const downloadJSON = (): void => {
    const jsonOutput = `export const Kyc = ${generateJSON()};`;
    const blob = new Blob([jsonOutput], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kyc-config.js";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDocumentNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setNewDocument({ ...newDocument, fileName: e.target.value });
  };

  const handleMultipleFilesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setNewDocument({ ...newDocument, multipleFiles: e.target.checked });
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedFieldIndex(index);
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault();
    setDropTargetIndex(index);
  };

  const handleDragLeave = () => {
    setDropTargetIndex(null);
  };

  const handleDrop = (dropIndex: number) => {
    if (
      selectedDocument === null ||
      draggedFieldIndex === null ||
      draggedFieldIndex === dropIndex
    )
      return;

    const updatedDocuments = [...documents];
    const fields = updatedDocuments[selectedDocument].formFields;
    const [removed] = fields.splice(draggedFieldIndex, 1);
    fields.splice(dropIndex, 0, removed);
    setDocuments(updatedDocuments);
    setDraggedFieldIndex(null);
    setDropTargetIndex(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 relative overflow-hidden w-full">
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center my-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mb-6 shadow-lg">
            <Sparkles className="w-10 h-10 text-white animate-pulse" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-4 animate-fade-in">
            KYC Form Builder
          </h1>
          <p className="text-xl text-blue-100 animate-fade-in-delay">
            Create stunning document verification forms with ease
          </p>
        </div>

        {/* Create Button */}
        <div className="text-center mb-12">
          <button
            onClick={() => setShowDocumentModal(true)}
            className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                         text-white px-10 py-5 rounded-2xl font-bold shadow-2xl hover:shadow-blue-500/25
                         transform hover:scale-105 transition-all duration-300 ease-out
                         flex items-center gap-3 mx-auto overflow-hidden"
          >
            <div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                              translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
            ></div>
            <Plus className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" />
            <span className="relative z-10">Create New Document</span>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/50 to-purple-400/50 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </button>
        </div>

        {/* Document Modal */}
        {showDocumentModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
              className="bg-white/95 backdrop-blur-md rounded-3xl p-8 w-full max-w-lg mx-4 
                              shadow-2xl border border-white/20 animate-scale-in"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Add New Document
                </h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Document Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {documentTypes.map((docType) => {
                      const IconComponent = docType.icon;
                      return (
                        <button
                          key={docType.value}
                          onClick={() =>
                            setNewDocument({
                              ...newDocument,
                              fileName: docType.label,
                            })
                          }
                          className={`p-4 border-2 rounded-xl flex flex-col items-center gap-3 
                                       transition-all duration-200 hover:scale-105 ${
                                         newDocument.fileName === docType.label
                                           ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20"
                                           : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                                       }`}
                        >
                          <IconComponent className="w-8 h-8 text-gray-600" />
                          <span className="text-sm font-semibold">
                            {docType.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Custom Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={newDocument.fileName}
                    onChange={handleDocumentNameChange}
                    className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none 
                                focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                                transition-all duration-200 bg-white/50"
                    placeholder="e.g., Passport, ID Card"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={newDocument.multipleFiles}
                      onChange={handleMultipleFilesChange}
                      className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-semibold group-hover:text-blue-600 transition-colors">
                      Allow Multiple Files
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowDocumentModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl 
                              hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={addDocument}
                  disabled={!newDocument.fileName.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white 
                              rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 
                              disabled:cursor-not-allowed transition-all duration-200 font-semibold
                              shadow-lg hover:shadow-xl"
                >
                  Add Document
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Documents List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {documents.map((doc, index) => (
            <div
              key={index}
              className="group bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 
                              hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 
                              hover:scale-105 border border-white/20 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {doc.fileName}
                  </h3>
                  <p className="text-blue-200 text-sm">
                    {doc.formFields.length} fields •{" "}
                    {doc.multipleFiles ? "Multiple files" : "Single file"}
                  </p>
                </div>
                <button
                  onClick={() => removeDocument(index)}
                  className="text-red-400 hover:text-red-300 transition-all duration-200 
                              p-2 hover:bg-red-500/20 rounded-full group-hover:scale-110"
                  aria-label={`Remove ${doc.fileName} document`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => openFieldBuilder(index)}
                className="w-full bg-white/20 hover:bg-white/30 text-white py-3 px-6 rounded-xl 
                            transition-all duration-200 font-semibold backdrop-blur-sm
                            hover:shadow-lg border border-white/30"
              >
                Configure Fields
              </button>
            </div>
          ))}
        </div>

        {/* Field Builder Modal */}
        {showFieldBuilder && selectedDocument !== null && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
              className="bg-white/95 backdrop-blur-md rounded-3xl w-full max-w-7xl max-h-[90vh] 
                              overflow-hidden flex shadow-2xl border border-white/20 animate-scale-in"
            >
              {/* Enhanced field types panel */}
              <div className="w-80 bg-gradient-to-br from-gray-50 to-white p-6 overflow-y-auto border-r border-gray-200">
                <h3 className="text-xl font-bold mb-6 text-gray-800">
                  Available Fields
                </h3>
                <div className="space-y-3">
                  {fieldTypes.map((fieldType, index) => (
                    <button
                      key={fieldType.id}
                      onClick={() => addField(fieldType)}
                      className="bg-white/80 p-4 rounded-xl shadow-md cursor-pointer 
                                  hover:shadow-lg hover:scale-105 transition-all duration-200 
                                  flex items-center gap-3 w-full border border-gray-100
                                  hover:border-blue-300 group animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                        {fieldType.icon}
                      </span>
                      <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                        {fieldType.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Builder Panel */}
              <div className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Move className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {documents[selectedDocument].fileName} - Form Fields
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowFieldBuilder(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors p-2 
                                hover:bg-gray-100 rounded-full"
                    aria-label="Close field builder"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {documents[selectedDocument].formFields.length === 0 ? (
                  <div className="text-center text-gray-500 py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                      <Plus className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-xl mb-2 font-semibold">No fields yet</p>
                    <p className="text-gray-400">
                      Click on any field type to add it to your form
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {documents[selectedDocument].formFields.map(
                      (field, fieldIndex) => (
                        <div
                          key={field.id}
                          draggable
                          onDragStart={() => handleDragStart(fieldIndex)}
                          onDragOver={(e) => handleDragOver(e, fieldIndex)}
                          onDragLeave={handleDragLeave}
                          onDrop={() => handleDrop(fieldIndex)}
                          className={`
        ${draggedFieldIndex === fieldIndex ? "dragging" : ""}
        ${
          dropTargetIndex === fieldIndex && draggedFieldIndex !== null
            ? "drop-target"
            : ""
        }
        transition-all duration-200
      `}
                          style={{ animationDelay: `${fieldIndex * 100}ms` }}
                        >
                          <Field
                            field={field}
                            fieldIndex={fieldIndex}
                            onUpdate={updateField}
                            onRemove={removeField}
                            onMoveUp={() => moveFieldUp(fieldIndex)}
                            onMoveDown={() => moveFieldDown(fieldIndex)}
                            isFirst={fieldIndex === 0}
                            isLast={
                              fieldIndex ===
                              documents[selectedDocument].formFields.length - 1
                            }
                          />
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* JSON Output */}
        {documents.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Generated JSON</h3>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button
                  onClick={downloadJSON}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`export const Kyc = ${generateJSON()};`}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFormBuilder;

// Add to your CSS (or Tailwind config if you use it):
// .dragging { opacity: 0.5; transform: scale(0.98) rotate(-2deg); transition: all 0.2s; }
// .drop-target { border: 2px dashed #3b82f6; background: #e0f2fe; transition: all 0.2s; }
