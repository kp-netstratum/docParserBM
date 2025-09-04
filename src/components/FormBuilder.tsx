/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from "react";

export type FormFieldDefinition = {
  name: string;
  type: string;
  required?: boolean;
  value?: string | number | boolean;
  placeHolder?: string;
  label?: string;
  options?: Array<{ label: string; value: string | number }>; // for select/radio
};

export interface FormBuilderProps {
  fields: FormFieldDefinition[];
  className?: string;
  onChange?: (values: Record<string, any>) => void;
  onSubmit?: (values: Record<string, any>) => void;
  submitText?: string;
  twoColumn?: boolean;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({
  fields,
  className,
  onChange,
  onSubmit,
  submitText = "Submit",
  twoColumn = true,
}) => {
  const initialValues = useMemo(() => {
    const acc: Record<string, any> = {};
    for (const f of fields) acc[f.name] = f.value ?? "";
    return acc;
  }, [fields]);

  const [values, setValues] = useState<Record<string, any>>(initialValues);

  // Keep internal state in sync when fields (and thus initialValues) change
  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  function handleFieldChange(name: string, value: any) {
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      onChange?.(next);
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit?.(values);
  }

  function renderField(field: FormFieldDefinition) {
    const common = {
      id: field.name,
      name: field.name,
      required: field.required ?? false,
      placeholder: field.placeHolder ?? "",
      className:
        "w-full px-4 py-2 rounded-md bg-[#111827] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500",
    } as const;

    const value = values[field.name] ?? "";

    switch (field.type) {
      case "textarea":
        return (
          <textarea {...common} value={value} onChange={(e) => handleFieldChange(field.name, e.target.value)} />
        );
      case "number":
        return (
          <input
            {...common}
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value === "" ? "" : Number(e.target.value))}
          />
        );
      case "date":
        return (
          <input {...common} type="date" value={value} onChange={(e) => handleFieldChange(field.name, e.target.value)} />
        );
      case "select":
        return (
          <select
            {...(common as any)}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-[#111827] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="" disabled>
              {field.placeHolder ?? "Select"}
            </option>
            {(field.options ?? []).map((opt) => (
              <option key={`${field.name}-${opt.value}`} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      case "checkbox":
        return (
          <input
            id={field.name}
            name={field.name}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => handleFieldChange(field.name, e.target.checked)}
            className="h-4 w-4 text-purple-600 bg-[#111827] border-gray-700 rounded focus:ring-purple-500"
          />
        );
      default:
        return (
          <input {...common} type={field.type || "text"} value={value} onChange={(e) => handleFieldChange(field.name, e.target.value)} />
        );
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className={twoColumn ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "grid grid-cols-1 gap-6"}>
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col gap-2">
            {field.label && (
              <label htmlFor={field.name} className="text-sm text-gray-300">
                {field.label}
              </label>
            )}
            {renderField(field)}
          </div>
        ))}
      </div>
      {onSubmit && (
        <div className="pt-6">
          <button
            type="submit"
            className="w-full py-2 rounded-md bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold shadow-md hover:opacity-90 transition"
          >
            {submitText}
          </button>
        </div>
      )}
    </form>
  );
};

export default FormBuilder;


