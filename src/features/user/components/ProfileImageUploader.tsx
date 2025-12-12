import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { ImageCropper } from './ImageCropper';
import { updateProfileImage } from '../api/updateProfileImage';
import { useAuth } from '../hooks/useAuth';

type ProfileImageUploaderProps = {
  initialUrl?: string | null;
  onUploaded?: (url: string) => void;
};

export function ProfileImageUploader({ initialUrl, onUploaded }: ProfileImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl ?? null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { refreshUser } = useAuth();

  useEffect(() => {
    setPreviewUrl(initialUrl ?? null);
  }, [initialUrl]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
    setIsCropping(true);

    // allow selecting the same file again
    e.target.value = '';
  };

  const handleCropComplete = async (blob: Blob) => {
    try {
      setIsUploading(true);
      const url = await updateProfileImage(blob);
      setPreviewUrl(url);
      onUploaded?.(url);
      await refreshUser();
    } catch (error) {
      console.error(error);
      alert('プロフィール画像の更新に失敗しました');
    } finally {
      setIsUploading(false);
      setIsCropping(false);
      setSelectedImage(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-20 h-20 border-2 border-border rounded-full bg-muted overflow-hidden flex items-center justify-center">
            {previewUrl ? (
              <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl text-secondary">👤</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2 border-2 border-primary bg-primary text-white rounded hover:bg-[#5A8BFF] transition-colors disabled:opacity-50"
          >
            {isUploading ? 'アップロード中...' : '画像を選択'}
          </button>
          <p className="text-xs text-secondary">画像を選択してトリミングできます</p>
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {isCropping && selectedImage && (
        <ImageCropper
          imageSrc={selectedImage}
          onCancel={() => {
            setIsCropping(false);
            setSelectedImage(null);
          }}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}
