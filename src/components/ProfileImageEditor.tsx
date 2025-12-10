import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/libs/imageUtils';

export type Area = {
  width: number;
  height: number;
  x: number;
  y: number;
};

type ProfileImageEditorProps = {
  imageSrc: string;
  onCancel: () => void;
  onSave: (blob: Blob) => Promise<void>;
};

export function ProfileImageEditor({ imageSrc, onCancel, onSave }: ProfileImageEditorProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;

    try {
      setIsSaving(true);
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      if (croppedImage) {
        await onSave(croppedImage);
      }
    } catch (e) {
      console.error(e);
      alert('画像の保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative w-full max-w-md bg-background rounded-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h3 className="text-lg font-bold">プロフィール画像の調整</h3>
          <button onClick={onCancel} className="text-secondary hover:text-primary">
            ✕
          </button>
        </div>

        <div className="relative w-full h-80 bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            rotation={rotation}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            showGrid={true}
            cropShape="round"
          />
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm mb-2 text-foreground">拡大・縮小</label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              onClick={onCancel}
              className="flex-1 py-2 border-2 border-border rounded hover:bg-muted transition-colors"
              disabled={isSaving}
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2 bg-primary text-white rounded hover:bg-[#5A8BFF] transition-colors disabled:opacity-50"
              disabled={isSaving}
            >
              {isSaving ? '保存中...' : '保存する'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
