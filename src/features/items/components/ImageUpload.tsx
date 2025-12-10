import { useRef } from 'react';

type ImageUploadProps = {
  files: File[];
  onChange: (files: File[]) => void;
  maxImages?: number;
};

export function ImageUpload({ files, onChange, maxImages = 3 }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const totalFiles = [...files, ...newFiles].slice(0, maxImages);
      onChange(totalFiles);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className="block text-sm mb-2 text-foreground">
        商品画像（1〜{maxImages}枚） <span className="text-destructive">*</span>
      </label>
      <div className="grid grid-cols-3 gap-4">
        {[...Array(maxImages)].map((_, i) => {
          const file = files[i];
          return (
            <button
              key={i}
              type="button"
              onClick={() => file ? removeFile(i) : triggerUpload()}
              className={`aspect-square border-2 rounded-lg flex items-center justify-center transition-all overflow-hidden relative ${
                file ? 'border-primary bg-info/10' : 'border-border bg-muted hover:border-primary'
              }`}
            >
              {file ? (
                <>
                   <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-xs">
                     削除
                   </div>
                </>
              ) : (
                <span className="text-4xl text-secondary">+</span>
              )}
            </button>
          );
        })}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />
      <p className="text-xs text-secondary mt-2">1枚目が代表画像になります</p>
    </div>
  );
}
