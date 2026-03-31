import { useState } from "react";

interface Country {
 code: string;
 label: string;
}

interface PhoneInputProps {
 countries?: Country[];
 placeholder?: string;
 value?: string;
 onChange?: (value: string) => void;
 selectPosition?: "start" | "end";
}

const PhoneInput: React.FC<PhoneInputProps> = ({
 countries = [],
 placeholder = "+1 (555) 000-0000",
 onChange,
 selectPosition = "start",
}) => {
 const [selectedCountry, setSelectedCountry] = useState("US");
 const [phoneNumber, setPhoneNumber] = useState("+1");

 const countryCodes = (countries || []).reduce<Record<string, string>>(
  (acc, { code, label }) => ({ ...acc, [code]: label }),
  {}
 );

 const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const newCountry = e.target.value;
  setSelectedCountry(newCountry);
  setPhoneNumber(countryCodes[newCountry]);

  if (onChange) onChange(countryCodes[newCountry]);
 };

 const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newPhoneNumber = e.target.value;
  setPhoneNumber(newPhoneNumber);

  if (onChange) onChange(newPhoneNumber);
 };

 return (
  <div className="relative flex">
   {/* Dropdown at Start */}
   {selectPosition === "start" && (
    <div className="absolute">
     <select
      value={selectedCountry}
      onChange={handleCountryChange}
      className="appearance-none bg-none rounded-l-lg border-0 border-r border-gray-200 bg-transparent py-3 pl-3.5 pr-8 leading-tight text-gray-700 
      focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 
      dark:border-gray-800 dark:text-gray-400"
     >
      {(countries || []).map((country) => (
       <option
        key={country.code}
        value={country.code}
        className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
       >
        {country.code}
       </option>
      ))}
     </select>

     {/* Dropdown Arrow */}
     <div className="absolute inset-y-0 right-3 flex items-center text-gray-700 pointer-events-none dark:text-gray-400">
      <svg
       className="stroke-current"
       width="20"
       height="20"
       viewBox="0 0 20 20"
       fill="none"
      >
       <path
        d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
       />
      </svg>
     </div>
    </div>
   )}

   {/* Input */}
   <input
    type="tel"
    value={phoneNumber}
    onChange={handlePhoneNumberChange}
    placeholder={placeholder}
    className={`h-11 w-full rounded-lg border border-gray-300 bg-transparent py-3 px-4 text-sm text-gray-800 
    placeholder:text-gray-400 shadow-theme-xs 
    focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 
    dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 
    ${selectPosition === "start" ? "pl-[84px]" : "pr-[84px]"}`}
   />

   {/* Dropdown at End */}
   {selectPosition === "end" && (
    <div className="absolute right-0">
     <select
      value={selectedCountry}
      onChange={handleCountryChange}
      className="appearance-none bg-none rounded-r-lg border-0 border-l border-gray-200 bg-transparent py-3 pl-3.5 pr-8 leading-tight text-gray-700 
      focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 
      dark:border-gray-800 dark:text-gray-400"
     >
      {(countries || []).map((country) => (
       <option
        key={country.code}
        value={country.code}
        className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
       >
        {country.code}
       </option>
      ))}
     </select>

     {/* Arrow Icon */}
     <div className="absolute inset-y-0 right-3 flex items-center text-gray-700 pointer-events-none dark:text-gray-400">
      <svg
       className="stroke-current"
       width="20"
       height="20"
       viewBox="0 0 20 20"
       fill="none"
      >
       <path
        d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
       />
      </svg>
     </div>
    </div>
   )}
  </div>
 );
};

export default PhoneInput;
