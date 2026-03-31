'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, ImagePlus } from 'lucide-react';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ images, onChange, maxImages = 6 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    );

    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.secure_url;
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remaining = maxImages - images.length;
    const toUpload = Array.from(files).slice(0, remaining);

    setUploading(true);
    try {
      const urls = await Promise.all(toUpload.map(uploadToCloudinary));
      onChange([...images, ...urls]);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Upload Zone */}
      {images.length < maxImages && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all"
        >
          {uploading ? (
            <>
              <Loader2 size={28} className="text-blue-500 animate-spin" />
              <p className="text-sm text-slate-500 dark:text-slate-400">Uploading...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                <ImagePlus size={22} className="text-slate-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Drop images here or click to browse
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  PNG, JPG up to 10MB · {images.length}/{maxImages} uploaded
                </p>
              </div>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((url, index) => (
            <div key={url} className="relative aspect-square rounded-xl overflow-hidden group">
              <img src={url} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              {index === 0 && (
                <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// VideoUpload component — separate named export

interface VideoUploadProps {
  videoUrl: string;
  onChange: (url: string) => void;
}

export function VideoUpload({ videoUrl, onChange }: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadVideo = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    formData.append('resource_type', 'video');

    setUploading(true);
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
        { method: 'POST', body: formData }
      );
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      onChange(data.secure_url);
    } catch (err) {
      console.error('Video upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {!videoUrl ? (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all"
        >
          {uploading ? (
            <>
              <Loader2 size={28} className="text-blue-500 animate-spin" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Uploading video... this may take a moment
              </p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                <Upload size={22} className="text-slate-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Click to upload a video
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  MP4, MOV up to 100MB · Optional
                </p>
              </div>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && uploadVideo(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden bg-black">
          <video
            src={videoUrl}
            controls
            className="w-full max-h-64 object-cover"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-3 right-3 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}