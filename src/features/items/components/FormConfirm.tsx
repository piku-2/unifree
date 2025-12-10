import { ItemInput } from '../schema';

type FormConfirmProps = {
  data: ItemInput;
  images: File[];
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
};

export function FormConfirm({ data, images, onConfirm, onCancel, loading }: FormConfirmProps) {
  const mainImage = images.length > 0 ? URL.createObjectURL(images[0]) : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg p-6 max-w-md w-full shadow-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">出品内容の確認</h3>

        <div className="space-y-4 mb-6">
          <div className="flex gap-4 border p-4 rounded bg-card">
            <div className="w-20 h-20 bg-muted flex-shrink-0 rounded overflow-hidden">
               {mainImage ? (
                   <img src={mainImage} className="w-full h-full object-cover" alt="prev" />
               ) : (
                   <div className="w-full h-full bg-gray-200" />
               )}
            </div>
            <div>
              <p className="font-bold">{data.title}</p>
              <p className="text-accent text-lg">¥{data.price.toLocaleString()}</p>
              <span className="text-xs bg-muted px-2 py-1 rounded">{data.category}</span>
            </div>
          </div>

          <div className="text-sm space-y-2">
            <p><span className="text-secondary">状態:</span> {data.status === 'on_sale' ? (data as any).condition || '未設定' : data.status}</p>
            <p className="bg-muted p-2 rounded whitespace-pre-wrap">{data.description}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-3 border border-border rounded hover:bg-muted"
          >
            修正する
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 bg-accent text-white rounded hover:bg-[#FF7F50] disabled:opacity-50"
          >
            {loading ? '出品中...' : '出品する'}
          </button>
        </div>
      </div>
    </div>
  );
}
