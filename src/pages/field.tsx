import React from "react";

interface FormField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  value: string;
  placeHolder: string;
  label: string;
}

interface FieldProps {
  field: FormField;
  fieldIndex: number;
  onUpdate: (fieldIndex: number, property: keyof FormField, value: string | boolean) => void;
  onRemove: (fieldIndex: number) => void;
  isFirst?: boolean;
  isLast?: boolean;
}

const Field: React.FC<FieldProps> = ({
  field,
  fieldIndex,
  onUpdate,
  onRemove,
  isFirst,
  isLast,
}) => {
  return (
    <div className="border p-4 rounded mb-4">
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Label</label>
        <input
          type="text"
          value={field.label}
          onChange={(e) => onUpdate(fieldIndex, "label", e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          value={field.name}
          onChange={(e) => onUpdate(fieldIndex, "name", e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Type</label>
        <select
          value={field.type}
          onChange={(e) => onUpdate(fieldIndex, "type", e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="email">Email</option>
          <option value="checkbox">Checkbox</option>
          <option value="textarea">Textarea</option>
        </select>
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Placeholder</label>
        <input
          type="text"
          value={field.placeHolder}
          onChange={(e) => onUpdate(fieldIndex, "placeHolder", e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">
          Required
          <input
            type="checkbox"
            checked={field.required}
            onChange={(e) => onUpdate(fieldIndex, "required", e.target.checked)}
            className="ml-2"
          />
        </label>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => onRemove(fieldIndex)}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default Field;