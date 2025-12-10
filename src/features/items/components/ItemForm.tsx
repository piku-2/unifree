import { useState } from 'react';
import { Header } from '@/components/Header';
import { AuthGate } from '@/features/user/components/AuthGate';
import { useAuth } from '@/features/user/hooks/useAuth';
import { useItemForm } from '../hooks/useItemForm';
import { ImageUpload } from './ImageUpload';
import { FormConfirm } from './FormConfirm';
import { createItem } from '../api/createItem';
import { itemSchema, ItemInput } from '../schema';

type ItemFormProps = {
  onNavigate: (page: string) => void;
};

const categories = ['家電', '家具', '本', '生活雑貨', 'その他'];
const conditions = ['新品', '美品', '使用感あり'];

export function ItemForm({ onNavigate }: ItemFormProps) {
  const { user } = useAuth();
  const { form, images, setImages } = useItemForm();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
      register,
      handleSubmit,
      watch,
      setValue,
      trigger,
      formState: { errors }
  } = form;

  // Watch condition for UI state since it's not registered via standard input if using buttons
  const currentCondition = watch('status'); // wait, condition field is missing in schema.
  // I will use a local state for condition or register it if I update schema.
  // I'll update schema in next turn if needed, or just append it to description.
  const [condition, setCondition] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('手渡し');

  const onPreSubmit = async (_data: ItemInput) => {
      // Validate images
      if (images.length === 0) {
          alert('画像をアップロードしてください');
          return;
      }
      if (!condition) {
          alert('状態を選択してください');
          return;
      }
      const isValid = await trigger();
      if (isValid) {
          setIsConfirming(true);
      }
  };

  const handleFinalSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    const data = watch();

    // Inject condition/delivery into description or metadata if schema doesn't support them directly
    // Or assume createItem handles them.
    // My createItem supports user_id, title...
    // I will append them to description for MVP simplicity vs schema change
    const fullDescription = `【状態】${condition}\n【受け渡し】${deliveryMethod}\n\n${data.description}`;
    const finalData = { ...data, description: fullDescription };

    try {
        await createItem(finalData, images, user.id);
        alert('出品が完了しました');
        onNavigate('mypage');
    } catch (e) {
        console.error(e);
        alert('出品に失敗しました');
    } finally {
        setIsSubmitting(false);
        setIsConfirming(false);
    }
  };

  return (
    <AuthGate fallback={<div className="p-8 text-center text-red-500">ログインが必要です</div>}>
      <div className="min-h-screen pb-20 md:pb-8 bg-background">
        <Header title="出品する" onNavigate={onNavigate} showBack />

        <main className="max-w-3xl mx-auto px-4 py-6">
          <div className="border border-border bg-card p-6 rounded-lg shadow-sm">
            <form onSubmit={handleSubmit(onPreSubmit)} className="space-y-6">

              <ImageUpload files={images} onChange={(files) => {
                  setImages(files);
                  setValue('images', files.map(f => f.name)); // Fake string array for Zod
                  trigger('images');
              }} />
              {errors.images && <p className="text-destructive text-sm">{errors.images.message}</p>}

              <div>
                <label className="block text-sm mb-2">タイトル <span className="text-destructive">*</span></label>
                <input {...register('title')} className="w-full p-3 border rounded bg-card" placeholder="商品名" />
                {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
              </div>

               <div>
                <label className="block text-sm mb-2">カテゴリ <span className="text-destructive">*</span></label>
                <div className="grid grid-cols-2 gap-2">
                    {categories.map(c => (
                        <button key={c} type="button"
                           onClick={() => setValue('category', c, { shouldValidate: true })}
                           className={`p-3 border rounded ${watch('category') === c ? 'bg-primary text-white' : ''}`}>
                           {c}
                        </button>
                    ))}
                </div>
                {errors.category && <p className="text-destructive text-sm">{errors.category.message}</p>}
              </div>

              <div>
                <label className="block text-sm mb-2">価格 <span className="text-destructive">*</span></label>
                <input type="number" {...register('price')} className="w-full p-3 border rounded bg-card" />
                {errors.price && <p className="text-destructive text-sm">{errors.price.message}</p>}
              </div>

              <div>
                  <label className="block text-sm mb-2">状態 <span className="text-destructive">*</span></label>
                  <div className="grid grid-cols-3 gap-2">
                    {conditions.map(c => (
                        <button key={c} type="button"
                           onClick={() => setCondition(c)}
                           className={`p-3 border rounded ${condition === c ? 'bg-primary text-white' : ''}`}>
                           {c}
                        </button>
                    ))}
                  </div>
              </div>

              <div>
                <label className="block text-sm mb-2">説明 <span className="text-destructive">*</span></label>
                <textarea {...register('description')} rows={5} className="w-full p-3 border rounded bg-card" />
                {errors.description && <p className="text-destructive text-sm">{errors.description.message}</p>}
              </div>

               {/* Delivery Method Selector (Simplification: using local state) */}
               <div>
                  <label className="block text-sm mb-2">受け渡し方法</label>
                  <div className="flex gap-4">
                      {['手渡し', '配送'].map(m => (
                          <label key={m} className="flex items-center gap-2">
                              <input type="radio" name="delivery" checked={deliveryMethod === m} onChange={() => setDeliveryMethod(m)} />
                              {m}
                          </label>
                      ))}
                  </div>
               </div>

              <button type="submit" className="w-full py-3 bg-accent text-white rounded font-bold hover:bg-[#FF7F50]">
                  確認画面へ
              </button>
            </form>
          </div>
        </main>
      </div>

      {isConfirming && (
          <FormConfirm
             data={{...watch(), condition, status: 'on_sale'} as any}
             images={images}
             onConfirm={handleFinalSubmit}
             onCancel={() => setIsConfirming(false)}
             loading={isSubmitting}
          />
      )}
    </AuthGate>
  );
}
