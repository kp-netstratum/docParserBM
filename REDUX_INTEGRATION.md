# Redux Data Persistence Integration

This document explains the Redux data persistence system implemented in your application for managing form data and application state across components.

## Overview

The application now uses Redux with Redux Persist to automatically save and restore state data. This ensures that:
- Application data persists across browser sessions
- Form builder data is saved automatically
- User can navigate between pages without losing data
- All form configurations are preserved

## Key Components

### 1. Redux Store Configuration (`src/store/index.ts`)
- Configured with `redux-persist` for automatic localStorage persistence
- Only the `form` slice is persisted to avoid saving unnecessary data
- Includes proper middleware configuration for persistence

### 2. Enhanced Form Slice (`src/slices/formSlice.ts`)
- **Applications**: Track created applications with metadata (id, timestamps)
- **Current Application**: Track which application is currently active
- **Form Builder Data**: Store form configurations created in the form builder
- **Selected Documents**: Track documents selected for current workflow

#### Key Actions Available:
```typescript
// Application Management
addApplication({ name, description })
removeApplication(applicationId)
updateApplication({ id, data })
setCurrentApplication(applicationId)

// Form Builder Data
setFormBuilderData(documents)
addFormBuilderDocument(document)
updateFormBuilderDocument({ index, data })
removeFormBuilderDocument(index)

// Workflow Management  
setSelectedDocuments(documents)
setMainJson(jsonData)
```

### 3. Component Integration

#### Dashboard (`src/pages/dashBoard.tsx`)
- **Creates applications** when user selects KYC or custom forms
- **Displays custom applications** created in the form builder
- **Shows recent applications** with metadata
- **Integrates with Redux** for state management

#### Admin Form Builder (`src/pages/adminFormBuilder.tsx`)
- **Automatically saves** all form configurations to Redux
- **Persists document structures** and field definitions
- **Syncs local state** with Redux state on component mount
- **Updates Redux** on every form modification

#### Analysis Page (`src/pages/analysis.tsx`)
- **Retrieves application data** from Redux store
- **Shows application context** in the UI
- **Uses persisted form configurations** for analysis
- **Maintains analysis results** in component state

## How Data Flows

### 1. Creating an Application
```typescript
// User clicks "KYC Application" on Dashboard
dispatch(addApplication({ 
  name: "KYC Application", 
  description: "Know Your Customer verification process" 
}));
```

### 2. Building Forms
```typescript
// User creates documents in Form Builder
dispatch(addFormBuilderDocument({
  fileName: "Passport",
  fileType: "document", 
  formFields: [...]
}));
```

### 3. Using Forms
```typescript
// Dashboard shows available forms from Redux
const formBuilderData = useAppSelector(state => state.form.formBuilderData);
// User can select and navigate to document processor
```

### 4. Analysis
```typescript
// Analysis page gets current application context
const currentApplication = useAppSelector(state => state.form.currentApplication);
```

## Benefits

### 1. **Data Persistence**
- All data automatically saved to browser localStorage
- Survives page refreshes and browser restarts
- No data loss during navigation

### 2. **Centralized State**
- Single source of truth for all application data
- Consistent data across all components
- Easy to debug and maintain

### 3. **Enhanced User Experience**
- Form builder work is never lost
- Quick access to previously created applications
- Seamless workflow between components

### 4. **Developer Benefits**
- Type-safe state management with TypeScript
- Predictable state updates
- Easy to extend with new features

## Usage Examples

### Creating a New Application Type
```typescript
// In any component
const dispatch = useAppDispatch();

dispatch(addApplication({
  name: "Loan Application",
  description: "Personal loan verification process"
}));
```

### Adding Form Fields Programmatically
```typescript
const newDocument = {
  fileName: "Income Verification",
  fileType: "pdf",
  formFields: [
    {
      id: "salary",
      name: "monthly_salary", 
      type: "number",
      required: true,
      label: "Monthly Salary",
      placeHolder: "Enter monthly salary"
    }
  ]
};

dispatch(addFormBuilderDocument(newDocument));
```

### Accessing Current Application Data
```typescript
// In any component
const currentApp = useAppSelector(state => state.form.currentApplication);
const allApps = useAppSelector(state => state.form.applications);
const formData = useAppSelector(state => state.form.formBuilderData);
```

## Testing the Integration

1. **Create a new form** in the Form Builder
2. **Navigate away** from the page
3. **Return to Dashboard** - your custom form should appear
4. **Refresh the browser** - all data should persist
5. **Select the custom form** - it should work in the document processor

## Future Enhancements

Consider adding:
- **Import/Export functionality** for form configurations
- **Form templates** for common use cases  
- **User authentication** integration
- **Cloud sync** for cross-device persistence
- **Form versioning** and change tracking
- **Validation rules** for form fields

## Troubleshooting

### Data Not Persisting
- Check browser localStorage is enabled
- Verify Redux DevTools for state updates
- Check console for persistence errors

### Form Builder Data Not Showing
- Ensure components use `useAppSelector` for state access
- Check that dispatch actions are being called
- Verify state structure matches selectors

### Performance Issues
- Consider implementing state normalization for large datasets
- Add memoization for expensive selectors
- Implement pagination for large application lists
