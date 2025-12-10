import { useState } from 'react';
import { Home } from './components/Home';
import { EventList } from './components/EventList';
import { EventDetail } from './components/EventDetail';
import { ItemList } from '@/features/items/components/ItemList';
import { ItemDetail } from '@/features/items/components/ItemDetail';
import { ItemForm as SellForm } from '@/features/items/components/ItemForm';
import { MyPage } from './components/MyPage';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { ChatList } from '@/features/chat/components/ChatList';
import { ChatRoom } from '@/features/chat/components/ChatRoom';

type Page = 'home' | 'login' | 'register' | 'event-list' | 'event-detail' | 'item-list' | 'item-detail' | 'sell' | 'mypage' | 'chat' | 'chat-room' | 'admin';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');

  const handleNavigate = (page: string, params?: any) => {
    setCurrentPage(page as Page);
    if (params) {
      if (params.itemId) setSelectedItemId(params.itemId);
      if (params.eventId) setSelectedEventId(params.eventId);
      if (params.roomId) setSelectedRoomId(params.roomId);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'item-list':
        return <ItemList onNavigate={handleNavigate} onSelectItem={(id) => handleNavigate('item-detail', { itemId: id })} />;
      case 'event-list':
        return <EventList onNavigate={handleNavigate} onSelectEvent={(id) => handleNavigate('event-detail', { eventId: id })} />;
      case 'event-detail':
        return <EventDetail eventId={selectedEventId} onNavigate={handleNavigate} onSelectItem={(id) => handleNavigate('item-detail', { itemId: id })} />;
      case 'item-detail':
        return <ItemDetail itemId={selectedItemId} onNavigate={handleNavigate} />;
      case 'sell':
        return <SellForm onNavigate={handleNavigate} />;
      case 'mypage':
        return <MyPage onNavigate={handleNavigate} onSelectItem={(id) => handleNavigate('item-detail', { itemId: id })} />;
      case 'chat':
        return <ChatList onNavigate={handleNavigate} />;
      case 'chat-room':
        return <ChatRoom roomId={selectedRoomId} onNavigate={handleNavigate} />;
      case 'login':
        return <Login onNavigate={handleNavigate} />;
      case 'register':
        return <Register onNavigate={handleNavigate} />;
      case 'admin':
        return <AdminDashboard onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderPage()}

      {/* Navigation Bar */}
      {currentPage !== 'login' && currentPage !== 'register' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border flex justify-around p-3 md:hidden z-50">
          <button onClick={() => setCurrentPage('home')} className={`flex flex-col items-center text-xs ${currentPage === 'home' ? 'text-primary' : 'text-secondary'}`}>
            <span className="text-xl">🏠</span>
            ホーム
          </button>
          <button onClick={() => setCurrentPage('item-list')} className={`flex flex-col items-center text-xs ${currentPage === 'item-list' ? 'text-primary' : 'text-secondary'}`}>
            <span className="text-xl">🔍</span>
            さがす
          </button>
          <button onClick={() => setCurrentPage('sell')} className={`flex flex-col items-center text-xs ${currentPage === 'sell' ? 'text-primary' : 'text-secondary'}`}>
            <div className="bg-accent text-white rounded-full w-10 h-10 flex items-center justify-center -mt-5 shadow-lg border-4 border-background">
              <span className="text-xl">📷</span>
            </div>
            出品
          </button>
          <button onClick={() => setCurrentPage('chat')} className={`flex flex-col items-center text-xs ${currentPage === 'chat' || currentPage === 'chat-room' ? 'text-primary' : 'text-secondary'}`}>
            <span className="text-xl">💬</span>
            チャット
          </button>
          <button onClick={() => setCurrentPage('mypage')} className={`flex flex-col items-center text-xs ${currentPage === 'mypage' ? 'text-primary' : 'text-secondary'}`}>
            <span className="text-xl">👤</span>
            マイページ
          </button>
        </nav>
      )}
    </div>
  );
}
