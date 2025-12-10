import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { itemSchema, ItemInput } from '../schema';
import { uploadImage } from '../api/uploadImage';
import { createItem } from '../api/createItem';
import { useAuth } from '@/features/user/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';

export function useItemForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ItemInput>({
    resolver: zodResolver(itemSchema) as any, // Cast to any to resolve strict type mismatch with RHF
    defaultValues: {
      status: 'on_sale',
      images: [],
      title: '',
      description: '',
      price: 0,
      category: '',
    }
  });

  const saveItem = async (data: ItemInput) => {
    if (!user) {
      alert('ログインが必要です');
      return;
    }
    if (images.length === 0) {
      alert('画像を少なくとも1枚選択してください');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload images
      const uploadPromises = images.map(file => uploadImage(file, user.id));
      const imageUrls = await Promise.all(uploadPromises);

      // 2. Create item with image URLs
      await createItem({
        ...data,
        images: imageUrls,
      }, user.id);

      alert('出品しました！');
      navigate(ROUTES.HOME);
    } catch (error: any) {
      console.error('Submission error:', error);
      alert('エラーが発生しました: ' + (error.message || '不明なエラー'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return { form, images, setImages, saveItem, isSubmitting };
}
