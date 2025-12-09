import { useState } from 'react';
import { Home } from './components/Home';
import { EventList } from './components/EventList';
import { EventDetail } from './components/EventDetail';
import { ItemList } from './components/ItemList';
import { ItemDetail } from './components/ItemDetail';
import { SellForm } from './components/SellForm';
import { MyPage } from './components/MyPage';
import { Login } from './components/Login';
import { Register } from './components/Register';

type Page = 'home' | 'events' | 'event-detail' | 'items' | 'item-detail' | 'sell' | 'mypage' | 'login' | 'register';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedEventId, setSelectedEventId] = useState<string>('1');
  const [selectedItemId, setSelectedItemId] = useState<string>('1');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'events':
        return <EventList onNavigate={setCurrentPage} onSelectEvent={setSelectedEventId} />;
      case 'event-detail':
        return <EventDetail eventId={selectedEventId} onNavigate={setCurrentPage} onSelectItem={setSelectedItemId} />;
      case 'items':
        return <ItemList onNavigate={setCurrentPage} onSelectItem={setSelectedItemId} />;
      case 'item-detail':
        return <ItemDetail itemId={selectedItemId} onNavigate={setCurrentPage} />;
      case 'sell':
        return <SellForm onNavigate={setCurrentPage} />;
      case 'mypage':
        return <MyPage onNavigate={setCurrentPage} onSelectItem={setSelectedItemId} />;
      case 'login':
        return <Login onNavigate={setCurrentPage} />;
      case 'register':
        return <Register onNavigate={setCurrentPage} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderPage()}
      
      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:hidden shadow-lg">
        <div className="flex justify-around items-center h-16">
          <button onClick={() => setCurrentPage('home')} className={`flex flex-col items-center gap-1 px-4 py-2 ${currentPage === 'home' ? 'text-primary' : 'text-secondary'}`}>
            <div className={`w-6 h-6 border-2 rounded ${currentPage === 'home' ? 'border-primary' : 'border-secondary'}`}></div>
            <span className="text-xs">ホーム</span>
          </button>
          <button onClick={() => setCurrentPage('events')} className={`flex flex-col items-center gap-1 px-4 py-2 ${currentPage === 'events' ? 'text-primary' : 'text-secondary'}`}>
            <div className={`w-6 h-6 border-2 rounded ${currentPage === 'events' ? 'border-primary' : 'border-secondary'}`}></div>
            <span className="text-xs">イベント</span>
          </button>
          <button onClick={() => setCurrentPage('items')} className={`flex flex-col items-center gap-1 px-4 py-2 ${currentPage === 'items' ? 'text-primary' : 'text-secondary'}`}>
            <div className={`w-6 h-6 border-2 rounded ${currentPage === 'items' ? 'border-primary' : 'border-secondary'}`}></div>
            <span className="text-xs">出品</span>
          </button>
          <button onClick={() => setCurrentPage('mypage')} className={`flex flex-col items-center gap-1 px-4 py-2 ${currentPage === 'mypage' ? 'text-primary' : 'text-secondary'}`}>
            <div className={`w-6 h-6 border-2 rounded ${currentPage === 'mypage' ? 'border-primary' : 'border-secondary'}`}></div>
            <span className="text-xs">マイページ</span>
          </button>
        </div>
      </nav>
    </div>
  );
}