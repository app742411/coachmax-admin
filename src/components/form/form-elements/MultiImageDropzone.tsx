import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { X, UploadCloud } from "lucide-react";

interface MultiImageDropzoneProps {
  onUpload?: (files: File[]) => void;
  maxFiles?: number;
  initialImages?: string[];
  onRemoveInitial?: (imagePath: string) => void;
}

const MultiImageDropzone: React.FC<MultiImageDropzoneProps> = ({ 
  onUpload, 
  maxFiles = 5,
  initialImages = [],
  onRemoveInitial
}) => {
  const [files, setFiles] = useState<(File & { preview: string })[]>([]);

  useEffect(() => {
    // Revoke data uris to avoid memory leaks
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));

    setFiles(prevFiles => {
      const combined = [...prevFiles, ...newFiles].slice(0, maxFiles - initialImages.length);
      if (onUpload) {
        onUpload(combined);
      }
      return combined;
    });
  };

  const removeFile = (fileToRemove: File & { preview: string }, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFiles = files.filter(file => file !== fileToRemove);
    setFiles(newFiles);
    if (onUpload) {
      onUpload(newFiles);
    }
  };

  const totalCount = files.length + initialImages.length;
  const remainingSlots = maxFiles - totalCount;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
      "image/svg+xml": [],
    },
    maxFiles: remainingSlots > 0 ? remainingSlots : 0,
    multiple: true
  });

  const hasReachedMax = totalCount >= maxFiles;

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith("http") || imagePath.startsWith("/images/")) {
      return imagePath;
    }
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
    return `${baseUrl.replace(/\/$/, '')}/${imagePath.replace(/^\//, '')}`;
  };

  return (
    <div className="space-y-4">
      {/* Dropzone Area */}
      {!hasReachedMax && (
        <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-none hover:border-brand-500">
          <div
            {...getRootProps()}
            className={`dropzone flex flex-col items-center justify-center rounded-none p-6 lg:p-8
          ${
            isDragActive
              ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
              : "bg-gray-50 dark:bg-gray-900"
          }
        `}
          >
            <input {...getInputProps()} disabled={hasReachedMax} />
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              <UploadCloud size={28} />
            </div>
            <h4 className="mb-2 font-semibold text-gray-800 text-base dark:text-white/90">
              {isDragActive ? "Drop Images Here" : "Drag & Drop Images"}
            </h4>
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 max-w-xs">
              Upload up to {maxFiles} images. (PNG, JPG, WEBP, SVG)
            </p>
            <p className="mt-2 text-xs font-semibold text-brand-500">
              {remainingSlots} slots remaining
            </p>
          </div>
        </div>
      )}

      {/* Previews Grid */}
      {totalCount > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Render initial images */}
          {initialImages.map((url, idx) => (
            <div key={`initial-${idx}`} className="relative group rounded-none overflow-hidden border border-gray-200 dark:border-gray-700 aspect-square bg-gray-50 dark:bg-gray-800">
              <img 
                src={getImageUrl(url)} 
                alt={`initial preview ${idx}`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onRemoveInitial) {
                      onRemoveInitial(url);
                    }
                  }}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  title="Remove image"
                  type="button"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}

          {/* Render new local files */}
          {files.map((file, idx) => (
            <div key={file.name + idx} className="relative group rounded-none overflow-hidden border border-gray-200 dark:border-gray-700 aspect-square bg-gray-50 dark:bg-gray-800">
              <img 
                src={file.preview} 
                alt={`preview ${idx}`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={(e) => removeFile(file, e)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  title="Remove image"
                  type="button"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiImageDropzone;
