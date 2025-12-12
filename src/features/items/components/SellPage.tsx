import { ChangeEvent, FormEvent, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ROUTES } from '@/config/routes';
import { NavigateHandler } from '@/config/navigation';
import { useAuth } from '@/features/user/hooks/useAuth';
import { createItem } from '../api/createItem';

type SellPageProps = {
  onNavigate: NavigateHandler;
};

type FormState = {
  title: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export function SellPage({ onNavigate }: SellPageProps) {
  const { user, loading } = useAuth();
  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    field: keyof FormState,
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setServerError(null);
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!form.title.trim()) {
      nextErrors.title = 'タイトルは必須です';
    }
    if (!form.description.trim()) {
      nextErrors.description = '説明は必須です';
    }
    if (!form.category.trim()) {
      nextErrors.category = 'カテゴリは必須です';
    }

    const priceValue = Number.parseInt(form.price, 10);
    if (!form.price.trim()) {
      nextErrors.price = '価格は必須です';
    } else if (!Number.isFinite(priceValue)) {
      nextErrors.price = '価格は数値で入力してください';
    } else if (priceValue < 100) {
      nextErrors.price = '最低価格は100円です';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await createItem({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        price: Number.parseInt(form.price, 10),
        image_url: form.imageUrl.trim() ? form.imageUrl.trim() : null,
        status: 'selling',
      });
      onNavigate('mypage');
    } catch (error) {
      const message = error instanceof Error ? error.message : '出品に失敗しました';
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!loading && !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-background">
      <Header title="出品する" onNavigate={onNavigate} showBack />

      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="border border-border bg-card p-6 rounded-lg shadow-sm">
          {serverError && (
            <div className="mb-4 p-3 border border-destructive text-destructive rounded bg-destructive/10">
              {serverError}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className={`space-y-6 ${isSubmitting ? 'opacity-60' : ''}`}
            aria-busy={isSubmitting}
          >
            <div>
              <label className="block text-sm mb-2">
                タイトル <span className="text-destructive">*</span>
              </label>
              <input
                value={form.title}
                onChange={handleChange('title')}
                className="w-full p-3 border rounded bg-card"
                placeholder="商品名"
                required
              />
              {errors.title && <p className="text-destructive text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm mb-2">
                説明 <span className="text-destructive">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={handleChange('description')}
                rows={5}
                className="w-full p-3 border rounded bg-card"
                placeholder="商品の状態や特徴を入力してください"
                required
              />
              {errors.description && (
                <p className="text-destructive text-sm mt-1">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-2">
                価格 <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                min={100}
                value={form.price}
                onChange={handleChange('price')}
                className="w-full p-3 border rounded bg-card"
                placeholder="100"
                required
              />
              {errors.price && <p className="text-destructive text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm mb-2">
                カテゴリ <span className="text-destructive">*</span>
              </label>
              <input
                value={form.category}
                onChange={handleChange('category')}
                className="w-full p-3 border rounded bg-card"
                placeholder="例) 家電 / 家具 など"
                required
              />
              {errors.category && <p className="text-destructive text-sm mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm mb-2">画像URL（任意）</label>
              <input
                value={form.imageUrl}
                onChange={handleChange('imageUrl')}
                className="w-full p-3 border rounded bg-card"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-accent text-white rounded font-bold hover:bg-[#FF7F50] disabled:opacity-70"
            >
              {isSubmitting ? '出品中...' : '出品する'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
