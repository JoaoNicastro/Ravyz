import { useState, useRef } from "react";
import { Upload, X, FileText, User, Camera } from "lucide-react";
import { cn } from "./ui/utils";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface FileUploadProps {
  type: 'image' | 'document';
  accept?: string;
  maxSize?: number; // in MB
  onFileSelect: (file: File | null) => void;
  currentFile?: File | string | null;
  className?: string;
  placeholder?: string;
}

export function FileUpload({
  type,
  accept,
  maxSize = 5,
  onFileSelect,
  currentFile,
  className,
  placeholder
}: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getDefaultAccept = () => {
    if (accept) return accept;
    if (type === 'image') return 'image/*';
    return '.pdf,.doc,.docx';
  };

  const validateFile = (file: File): boolean => {
    setError(null);

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Arquivo muito grande. Máximo ${maxSize}MB.`);
      return false;
    }

    // Check file type for images
    if (type === 'image' && !file.type.startsWith('image/')) {
      setError('Apenas arquivos de imagem são permitidos.');
      return false;
    }

    // Check file type for documents
    if (type === 'document') {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError('Apenas arquivos PDF, DOC ou DOCX são permitidos.');
        return false;
      }
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      onFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeFile = () => {
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFilePreview = () => {
    if (!currentFile) return null;

    if (typeof currentFile === 'string') {
      return type === 'image' ? (
        <ImageWithFallback src={currentFile} alt="Preview" className="w-full h-full object-cover" />
      ) : (
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-ravyz-blue" />
          <span className="text-sm text-ravyz-gray-700 truncate">Arquivo selecionado</span>
        </div>
      );
    }

    if (currentFile instanceof File) {
      if (type === 'image') {
        const imageUrl = URL.createObjectURL(currentFile);
        return <ImageWithFallback src={imageUrl} alt="Preview" className="w-full h-full object-cover" />;
      } else {
        return (
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-ravyz-blue" />
            <span className="text-sm text-ravyz-gray-700 truncate">{currentFile.name}</span>
          </div>
        );
      }
    }

    return null;
  };

  const hasFile = currentFile !== null && currentFile !== undefined;

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer",
          {
            "border-ravyz-orange bg-ravyz-orange/5": dragOver,
            "border-ravyz-gray-200 hover:border-ravyz-orange hover:bg-ravyz-orange/5": !dragOver && !hasFile,
            "border-ravyz-green bg-ravyz-green/5": hasFile && !error,
            "border-red-300 bg-red-50": error,
            "h-32": type === 'document',
            "h-40": type === 'image',
          }
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={getDefaultAccept()}
          onChange={handleInputChange}
          className="hidden"
        />

        {hasFile ? (
          <div className="relative w-full h-full p-4">
            {type === 'image' ? (
              <div className="w-full h-full rounded-lg overflow-hidden bg-ravyz-gray-200">
                {getFilePreview()}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                {getFilePreview()}
              </div>
            )}
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-ravyz-orange rounded-full flex items-center justify-center text-white hover:bg-ravyz-orange/90 transition-colors shadow-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            {type === 'image' ? (
              <Camera className="w-8 h-8 text-ravyz-gray-500 mb-2" />
            ) : (
              <Upload className="w-8 h-8 text-ravyz-gray-500 mb-2" />
            )}
            
            <p className="text-sm font-medium text-ravyz-gray-700 mb-1">
              {placeholder || (type === 'image' ? 'Adicionar foto' : 'Adicionar arquivo')}
            </p>
            
            <p className="text-xs text-ravyz-gray-500">
              {type === 'image' 
                ? `Clique ou arraste uma imagem (máx. ${maxSize}MB)`
                : `Clique ou arraste um arquivo PDF/DOC (máx. ${maxSize}MB)`
              }
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
          <X className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}