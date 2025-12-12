import { z } from 'zod';

export const itemSchema = z.object({
  title: z.string().min(1, '商品名は必須です').max(40, '40文字以内で入力してください'),
  description: z.string().min(1, '説明は必須です').max(1000, '1000文字以内で入力してください'),
  price: z.coerce
    .number()
    .min(100, '価格は100円以上で設定してください')
    .max(9999999, '価格は9,999,999円以下で設定してください'),
  category: z.string().min(1, 'カテゴリーを選択してください'),
  images: z.array(z.string()).min(1, '画像は少なくとも1枚必要です').max(10, '画像は10枚までです'),
  status: z.enum(['on_sale', 'sold_out', 'trading']).default('on_sale'),
});

export type ItemInput = z.infer<typeof itemSchema>;
