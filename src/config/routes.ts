export const ROUTES = {
  HOME: '/',
  ITEM_DETAIL: (id: string) => `/items/${id}`, // Adjusted based on standard patterns, will verify
  SELL: '/sell',
  MYPAGE: '/mypage',
  CHAT_LIST: '/chat',
  CHAT_ROOM: (roomId: string) => `/chat/${roomId}`,
  ADMIN: {
    DASHBOARD: '/admin',
    ITEMS: '/admin/items',
    ORDERS: '/admin/orders',
  },
  LOGIN: '/login',
} as const;
