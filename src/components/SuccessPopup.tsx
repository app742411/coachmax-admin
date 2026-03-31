import React from "react";
import Lottie from "lottie-react";
import successAnim from "../../src/assets/Footballer.json";

interface SuccessPopupProps {
 show?: boolean;
 message?: string;
 onClose: () => void;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ show = true, onClose, message }) => {
 if (!show) return null;

 return (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
   <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-[350px] text-center shadow-xl animate-slideUp">
    
    <Lottie animationData={successAnim} loop={false} className="w-40 mx-auto" />

    <h3 className="text-xl font-semibold mt-2 text-gray-800 dark:text-white">
     {message || "Player Added Successfully!"}
    </h3>

    <button
     onClick={onClose}
     className="mt-4 bg-brand-500 hover:bg-brand-600 text-white px-5 py-2 rounded-lg transition"
    >
     OK
    </button>
   </div>
  </div>
 );
};

export default SuccessPopup;
