import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { itemSchema, ItemInput } from '../schema';

export function useItemForm() {
  const [images, setImages] = useState<File[]>([]);
  const form = useForm<ItemInput>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      status: 'on_sale',
      images: [], // This will be handled manually via file upload syncing or keeping strings if existing
      title: '',
      description: '',
      price: 0,
      category: '',
    }
  });

  return { form, images, setImages };
}
