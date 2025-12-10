export type NavigateParams = {
  itemId?: string;
  eventId?: string;
  roomId?: string;
};

export type NavigatePage =
  | 'home'
  | 'item-list'
  | 'item-detail'
  | 'item-edit'
  | 'event-list'
  | 'event-detail'
  | 'sell'
  | 'mypage'
  | 'chat'
  | 'chat-room'
  | 'login'
  | 'register'
  | 'admin';

export type NavigateHandler = (page: NavigatePage, params?: NavigateParams) => void;
