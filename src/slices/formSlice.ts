/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface FormField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  value: string;
  placeHolder: string;
  label: string;
}

interface Application {
  id: string;
  name: string;
  description: string;
  data: FormField[];
  createdAt: string;
  updatedAt: string;
}

interface FormState {
  applications: Application[];
  currentApplication: Application | null;
  mainJson: {
    name: string;
    description: string;
    data: FormField[];
  }[];
  selectedDocuments: any[];
  formBuilderData: any[];
}

const initialState: FormState = {
  applications: [],
  currentApplication: null,
  mainJson: [],
  selectedDocuments: [],
  formBuilderData: [],
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    addApplication: (state, action: PayloadAction<{ name: string; description: string }>) => {
      const newApp: Application = {
        id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: action.payload.name,
        description: action.payload.description,
        data: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.applications.push(newApp);
      state.currentApplication = newApp;
    },
    removeApplication: (state, action: PayloadAction<string>) => {
      state.applications = state.applications.filter(app => app.id !== action.payload);
      if (state.currentApplication?.id === action.payload) {
        state.currentApplication = null;
      }
    },
    updateApplication: (state, action: PayloadAction<{ id: string; data: FormField[] }>) => {
      const appIndex = state.applications.findIndex(app => app.id === action.payload.id);
      if (appIndex !== -1) {
        state.applications[appIndex].data = action.payload.data;
        state.applications[appIndex].updatedAt = new Date().toISOString();
        if (state.currentApplication?.id === action.payload.id) {
          state.currentApplication = state.applications[appIndex];
        }
      }
    },
    setCurrentApplication: (state, action: PayloadAction<string | null>) => {
      if (action.payload === null) {
        state.currentApplication = null;
      } else {
        const app = state.applications.find(app => app.id === action.payload);
        state.currentApplication = app || null;
      }
    },
    clearApplications: (state) => {
      state.applications = [];
      state.currentApplication = null;
    },
    setMainJson: (
      state,
      action: PayloadAction<{
        name: string;
        description: string;
        data: FormField[];
      }[]>
    ) => {
      state.mainJson = action.payload ?? [];
    },
    setSelectedDocuments: (state, action: PayloadAction<any[]>) => {
      state.selectedDocuments = action.payload;
    },
    setFormBuilderData: (state, action: PayloadAction<any[]>) => {
      state.formBuilderData = action.payload;
    },
    addFormBuilderDocument: (state, action: PayloadAction<any>) => {
      console.log(action.payload, 'qwertyu')
      state.formBuilderData.push(action.payload);
    },
    updateFormBuilderDocument: (state, action: PayloadAction<{ index: number; data: any }>) => {
      if (state.formBuilderData[action.payload.index]) {
        state.formBuilderData[action.payload.index] = {
          ...state.formBuilderData[action.payload.index],
          ...action.payload.data,
        };
      }
    },
    removeFormBuilderDocument: (state, action: PayloadAction<number>) => {
      state.formBuilderData.splice(action.payload, 1);
    },
  },
});

export const { 
  addApplication, 
  removeApplication, 
  updateApplication, 
  setCurrentApplication,
  clearApplications, 
  setMainJson,
  setSelectedDocuments,
  setFormBuilderData,
  addFormBuilderDocument,
  updateFormBuilderDocument,
  removeFormBuilderDocument,
} = formSlice.actions;

export default formSlice.reducer;