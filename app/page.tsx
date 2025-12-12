'use client';

import { useRouter } from 'next/navigation';
import { Home } from '@/components/Home';
import { ROUTES } from '@/config/routes';
import { NavigateHandler } from '@/config/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleNavigate: NavigateHandler = (page, params) => {
    switch (page) {
      case 'home':
        router.push(ROUTES.HOME);
        break;
      case 'item-list':
        router.push(ROUTES.ITEM_LIST);
        break;
      case 'item-detail':
        router.push(
          params?.itemId
            ? ROUTES.ITEM_DETAIL.replace(':id', params.itemId)
            : ROUTES.ITEM_LIST
        );
        break;
      case 'item-edit':
        router.push(
          params?.itemId
            ? ROUTES.ITEM_EDIT.replace(':id', params.itemId)
            : ROUTES.MYPAGE
        );
        break;
      case 'sell':
        router.push(ROUTES.SELL);
        break;
      case 'mypage':
        router.push(ROUTES.MYPAGE);
        break;
      case 'profile_edit':
        router.push(ROUTES.PROFILE_EDIT);
        break;
      case 'chat':
        router.push(ROUTES.CHAT_LIST);
        break;
      case 'chat-room':
        router.push(
          params?.roomId
            ? ROUTES.CHAT_ROOM.replace(':roomId', params.roomId)
            : ROUTES.CHAT_LIST
        );
        break;
      case 'login':
        router.push(ROUTES.LOGIN);
        break;
      case 'register':
        router.push(ROUTES.REGISTER);
        break;
      case 'admin':
        router.push(ROUTES.ADMIN);
        break;
      case 'admin-items':
        router.push(ROUTES.ADMIN_ITEMS);
        break;
      case 'admin-orders':
        router.push(ROUTES.ADMIN_ORDERS);
        break;
      default:
        router.push(ROUTES.HOME);
    }
  };

  return <Home onNavigate={handleNavigate} />;
}
