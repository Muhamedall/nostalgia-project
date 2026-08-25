"use client";

import React, { forwardRef, Ref } from "react";

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ id, label, type, placeholder }, ref: Ref<HTMLInputElement>) => {
    return (
      <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          type={type}
          id={id}
          name={id}
          placeholder={placeholder}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          ref={ref} // Forward the ref to the input element
        />
      </div>
    );
  }
);

InputField.displayName = "InputField"; // Add display name for debugging

export default InputField;