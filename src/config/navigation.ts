export type NavigateParams = {
  itemId?: string;
  roomId?: string;
};

export type NavigatePage =
  | 'home'
  | 'item-list'
  | 'item-detail'
  | 'item-edit'
  | 'sell'
  | 'mypage'
  | 'chat'
  | 'chat-room'
  | 'login'
  | 'register'
  | 'admin'
  | 'admin-items'
  | 'admin-orders';

export type NavigateHandler = (page: NavigatePage, params?: NavigateParams) => void;
