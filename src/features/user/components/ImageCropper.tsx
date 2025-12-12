import { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/libs/imageUtils';

type CropArea = {
  width: number;
  height: number;
  x: number;
  y: number;
};

type ImageCropperProps = {
  imageSrc: string;
  onCancel: () => void;
  onCropComplete: (blob: Blob) => void;
};

export function ImageCropper({ imageSrc, onCancel, onCropComplete }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleCropComplete = useCallback((_croppedArea: CropArea, areaPixels: CropArea) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;

    try {
      setIsSaving(true);
      const blob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        0,
        { horizontal: false, vertical: false },
        'image/png',
      );

      if (!blob) {
        throw new Error('クロップに失敗しました');
      }

      onCropComplete(blob);
    } catch (error) {
      console.error(error);
      alert('画像のトリミングに失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative w-full max-w-xl bg-background rounded-lg overflow-hidden shadow-lg max-h-[90vh]">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h3 className="text-lg font-bold text-primary">画像を調整</h3>
          <button onClick={onCancel} className="text-secondary hover:text-primary">×</button>
        </div>

        <div className="relative w-full h-96 bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm mb-2 text-foreground">拡大・縮小</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              onClick={onCancel}
              className="flex-1 py-2 border-2 border-border rounded hover:bg-muted transition-colors disabled:opacity-50"
              disabled={isSaving}
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2 bg-primary text-white rounded hover:bg-[#5A8BFF] transition-colors disabled:opacity-50"
              disabled={isSaving}
            >
              {isSaving ? '処理中...' : '決定'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
