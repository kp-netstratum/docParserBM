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

interface FormState {
  applications: {
    name: string;
    description: string;
    data: FormField[];
  }[];
}

const initialState: FormState = {
  applications: [],
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    addApplication: (state, action: PayloadAction<{ name: string; description: string }>) => {
      state.applications.push({ name: action.payload.name, description: action.payload.description, data: [] });
    },
    removeApplication: (state, action: PayloadAction<number>) => {
      state.applications.splice(action.payload, 1);
    },
    updateApplication: (state, action: PayloadAction<{ index: number; data: FormField[] }>) => {
      state.applications[action.payload.index].data = action.payload.data;
    },
    clearApplications: (state) => {
      state.applications = [];
    },
  },
});

export const { addApplication, removeApplication, updateApplication, clearApplications } = formSlice.actions;

export default formSlice.reducer;