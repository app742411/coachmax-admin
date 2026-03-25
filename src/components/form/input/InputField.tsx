import { useState } from "react";

interface InputProps {
  type?: string;
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  disabled?: boolean;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  success?: boolean;
  error?: boolean;
  hint?: string;
  validate?: boolean;
  readOnly?: boolean;
}

const Input: React.FC<InputProps> = ({
  type = "text",
  id,
  name,
  placeholder = "Enter value...",
  value,
  onChange,
  className = "",
  min,
  max,
  step,
  disabled = false,
  required = false,
  minLength,
  maxLength,
  success = false,
  error = false,
  hint,
  validate = true, // enable built-in validation
  readOnly = false,
}) => {
  const [errorMessage, setErrorMessage] = useState("");

  // --------------------------------------------
  // VALIDATION LOGIC
  // --------------------------------------------
  const runValidation = (value: string | number) => {
    if (!validate) return;

    if (required && !value) {
      setErrorMessage("This field is required.");
      return;
    }

    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && typeof value === 'string' && !emailRegex.test(value)) {
        setErrorMessage("Enter a valid email address.");
        return;
      }
    }

    if (type === "number") {
      if (min !== undefined && Number(value) < Number(min)) {
        setErrorMessage(`Value must be ≥ ${min}.`);
        return;
      }
      if (max !== undefined && Number(value) > Number(max)) {
        setErrorMessage(`Value must be ≤ ${max}.`);
        return;
      }
    }

    if (minLength && typeof value === 'string' && value.length < minLength) {
      setErrorMessage(`Minimum length is ${minLength}.`);
      return;
    }

    if (maxLength && typeof value === 'string' && value.length > maxLength) {
      setErrorMessage(`Maximum length is ${maxLength}.`);
      return;
    }

    setErrorMessage("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    runValidation(val);
    if (onChange) onChange(e);
  };

  // --------------------------------------------
  // CLASS HANDLING
  // --------------------------------------------
  let inputClasses = `
    h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm 
    shadow-theme-xs placeholder:text-gray-400 
    dark:placeholder:text-white/30
    focus:outline-hidden focus:ring-3
    dark:bg-gray-900 dark:text-white/90
    ${className}
  `;

  if (disabled) {
    inputClasses += `
      text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed
      dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700
    `;
  } else if (error || errorMessage) {
    inputClasses += `
      border-error-500 focus:border-error-300 focus:ring-error-500/20
      dark:text-error-400 dark:border-error-500 dark:focus:border-error-800
    `;
  } else if (success) {
    inputClasses += `
      border-success-500 focus:border-success-300 focus:ring-success-500/20
      dark:text-success-400 dark:border-success-500 dark:focus:border-success-800
    `;
  } else {
    inputClasses += `
      bg-transparent text-gray-800 border-gray-300 
      focus:border-brand-300 focus:ring-brand-500/20 
      dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800
    `;
  }

  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}  // ✅ placeholder added & working
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        className={`${inputClasses} ${readOnly ? "bg-gray-50 dark:bg-gray-800/50 cursor-default" : ""}`}
      />

      {(errorMessage || hint) && (
        <p
          className={`mt-1.5 text-xs ${
            errorMessage
              ? "text-error-500"
              : success
              ? "text-success-500"
              : "text-gray-500"
          }`}
        >
          {errorMessage || hint}
        </p>
      )}
    </div>
  );
};

export default Input;
