import React from "react";
import GridShape from "../../components/common/GridShape";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";
import bgImage from "../../../public/images/image/loginbanner.jpg";

interface AuthLayoutProps {
 children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
 return (
  <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
   <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row">
    {children}

    <div
     className="items-center hidden w-full h-full lg:w-1/2 lg:grid dark:bg-white/5 bg-cover bg-center"
     style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover' }}
    >
     <div className="relative flex items-center justify-center z-1">
      {/* ===== Common Grid Shape Start ===== */}
      <GridShape />
     </div>
    </div>

    <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
     <ThemeTogglerTwo />
    </div>
   </div>
  </div>
 );
};

export default AuthLayout;
