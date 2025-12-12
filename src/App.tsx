import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Home } from './components/Home';
import { ItemList } from '@/features/items/components/ItemList';
import { ItemDetail } from '@/features/items/components/ItemDetail';
import { ItemForm } from '@/features/items/components/ItemForm';
import { MyPage } from './components/MyPage';
import { Login } from './components/Login';
import { ChatList } from '@/features/chat/components/ChatList';
import { ChatRoom } from '@/features/chat/components/ChatRoom';
import { AdminDashboard } from '@/features/admin/components/AdminDashboard';
import { AdminItemsPage } from '@/features/admin/components/AdminItemsPage';
import { AdminOrdersPage } from '@/features/admin/components/AdminOrdersPage';
import { AuthGate } from '@/features/user/components/AuthGate';
import { ROUTES } from '@/config/routes';
import { NavigateHandler, NavigatePage, NavigateParams } from '@/config/navigation';
import { SellPage } from '@/features/items/components/SellPage';
import { ProfileEditPage } from '@/features/user/components/ProfileEditPage';

function ItemDetailWrapper({ onNavigate }: { onNavigate: NavigateHandler }) {
  const { id } = useParams();
  return <ItemDetail itemId={id || ''} onNavigate={onNavigate} />;
}

function ItemEditWrapper({ onNavigate }: { onNavigate: NavigateHandler }) {
  const { id } = useParams();
  return <ItemForm itemId={id || ''} onNavigate={onNavigate} />;
}



function ChatRoomWrapper({ onNavigate }: { onNavigate: NavigateHandler }) {
  const { roomId } = useParams();
  return <ChatRoom roomId={roomId || ''} onNavigate={onNavigate} />;
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate: NavigateHandler = (page, params) => {
    switch (page) {
      case 'home':
        navigate(ROUTES.HOME);
        break;
      case 'item-list':
        navigate(ROUTES.ITEM_LIST);
        break;
      case 'item-detail':
        if (params?.itemId) {
          navigate(ROUTES.ITEM_DETAIL.replace(':id', params.itemId));
        } else {
          navigate(ROUTES.ITEM_LIST);
        }
        break;
      case 'item-edit':
        if (params?.itemId) {
          navigate(ROUTES.ITEM_EDIT.replace(':id', params.itemId));
        } else {
          navigate(ROUTES.MYPAGE);
        }
        break;

      case 'sell':
        navigate(ROUTES.SELL);
        break;
      case 'mypage':
        navigate(ROUTES.MYPAGE);
        break;
      case 'profile_edit':
        navigate(ROUTES.PROFILE_EDIT);
        break;
      case 'chat':
        navigate(ROUTES.CHAT_LIST);
        break;
      case 'chat-room':
        if (params?.roomId) {
          navigate(ROUTES.CHAT_ROOM.replace(':roomId', params.roomId));
        } else {
          navigate(ROUTES.CHAT_LIST);
        }
        break;
      case 'login':
        navigate(ROUTES.LOGIN);
        break;
      case 'register':
        navigate(ROUTES.REGISTER);
        break;
      case 'admin':
        navigate(ROUTES.ADMIN);
        break;
      case 'admin-items':
        navigate(ROUTES.ADMIN_ITEMS);
        break;
      case 'admin-orders':
        navigate(ROUTES.ADMIN_ORDERS);
        break;
      default:
        navigate(ROUTES.HOME);
    }
  };

  const isAuthPage =
    location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.REGISTER;

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path={ROUTES.HOME} element={<Home onNavigate={handleNavigate} />} />
        <Route path={ROUTES.ITEM_LIST} element={<ItemList onNavigate={handleNavigate} />} />
        <Route
          path={ROUTES.ITEM_DETAIL}
          element={<ItemDetailWrapper onNavigate={handleNavigate} />}
        />


        <Route element={<AuthGate redirectTo={ROUTES.LOGIN} />}>
          <Route path={ROUTES.SELL} element={<SellPage onNavigate={handleNavigate} />} />
          <Route path={ROUTES.ITEM_EDIT} element={<ItemEditWrapper onNavigate={handleNavigate} />} />
          <Route path={ROUTES.MYPAGE} element={<MyPage onNavigate={handleNavigate} />} />
          <Route path={ROUTES.PROFILE_EDIT} element={<ProfileEditPage onNavigate={handleNavigate} />} />
          <Route path={ROUTES.CHAT_LIST} element={<ChatList onNavigate={handleNavigate} />} />
          <Route path={ROUTES.CHAT_ROOM} element={<ChatRoomWrapper onNavigate={handleNavigate} />} />
          <Route path={ROUTES.ADMIN} element={<AdminDashboard onNavigate={handleNavigate} />} />
          <Route path={ROUTES.ADMIN_ITEMS} element={<AdminItemsPage onNavigate={handleNavigate} />} />
          <Route path={ROUTES.ADMIN_ORDERS} element={<AdminOrdersPage onNavigate={handleNavigate} />} />
        </Route>

        <Route path={ROUTES.LOGIN} element={<Login onNavigate={handleNavigate} />} />
        <Route path={ROUTES.REGISTER} element={<Login onNavigate={handleNavigate} />} />
      </Routes>

      {!isAuthPage && (
        <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border flex justify-around p-3 md:hidden z-50">
          {/* Buttons ... */}
        </nav>
      )}
    </div>
  );
}
