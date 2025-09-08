// filepath: c:\Users\Krishnaprasad\Netstratum\R&D\MdStatus\docParser\src\types\index.ts

export interface FormField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  value: string;
  placeHolder: string;
  label: string;
}

export interface Document {
  fileName: string;
  fileType: string;
  multipleFiles: boolean;
  formFields: FormField[];
}

export interface FieldType {
  id: string;
  type: string;
  label: string;
  icon: string;
}

export interface DocumentType {
  value: string;
  label: string;
  icon: any;
}