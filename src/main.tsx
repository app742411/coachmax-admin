import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { AppWrapper } from "./components/common/PageMeta";
import { ThemeProvider } from "./context/ThemeContext";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <ThemeProvider>
   <AppWrapper>
    <App />
    <Toaster
     position="top-right"
     toastOptions={{
      duration: 4000,
      success: {
       style: {
        background: "#172C53", // your brand primary for success
        color: "#fff",
       },
      },
      error: {
       style: {
        background: "#D02030", // brand red for errors
        color: "#fff",
       },
      },
     }}
    />
   </AppWrapper>
  </ThemeProvider>
);
