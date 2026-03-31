import { useState } from "react";
import { useDropzone } from "react-dropzone";
import ComponentCard from "../../common/ComponentCard";
import { UploadIcon } from "lucide-react";

interface DropzoneProps {
 onUpload?: (files: File[]) => void;
 maxFiles?: number;
}

const DropzoneComponent: React.FC<DropzoneProps> = ({ onUpload, maxFiles = 10 }) => {
 const [previewImages, setPreviewImages] = useState<string[]>([]);

 const onDrop = (acceptedFiles: File[]) => {
  if (acceptedFiles.length + previewImages.length > maxFiles) {
   alert(`You can upload a maximum of ${maxFiles} images.`);
   return;
  }

  // Generate preview URLs
  const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file));

  setPreviewImages((prev) => [...prev, ...newPreviews]);

  // Send files to parent component
  if (onUpload) {
   onUpload(acceptedFiles);
  }
 };

 const removeImage = (index: number) => {
  const updated = [...previewImages];
  updated.splice(index, 1);
  setPreviewImages(updated);
 };

 const { getRootProps, getInputProps, isDragActive } = useDropzone({
  onDrop,
  accept: {
   "image/png": [],
   "image/jpeg": [],
   "image/webp": [],
   "image/svg+xml": [],
  },
 });

 return (
  <ComponentCard title="Upload Player Images">
   <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">

    {/* Dropzone area */}
    <form
     {...getRootProps()}
     className={`rounded-xl border-dashed p-7 lg:p-10 
      ${
       isDragActive
        ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
        : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
      }`}
    >
     <input {...getInputProps()} />

     <div className="flex flex-col items-center">
      <div className="mb-5 flex justify-center">
       <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
        <UploadIcon/>
       </div>
      </div>

      <h4 className="mb-2 font-semibold text-gray-800 dark:text-white/90">
       {isDragActive ? "Drop Files Here" : "Drag & Drop Files Here"}
      </h4>

      <span className="text-sm text-gray-700 dark:text-gray-400 text-center mb-2">
       PNG, JPG, SVG, WebP — Max {maxFiles} images
      </span>

      <span className="font-medium underline text-brand-700 cursor-pointer ">
       Browse File
      </span>
     </div>
    </form>
   </div>

   {/* Preview grid */}
   {previewImages.length > 0 && (
    <div className="grid grid-cols-2 md:grid-cols-12 gap-4 mt-4">
     {previewImages.map((src, index) => (
      <div key={index} className="relative group">
       <img
        src={src}
        className="w-28 h-24 rounded-lg object-cover border"
       />

       {/* Delete Button */}
       <button
        type="button"
        onClick={() => removeImage(index)}
        className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded transition"
       >
        ×
       </button>
      </div>
     ))}
    </div>
   )}
  </ComponentCard>
 );
};

export default DropzoneComponent;
