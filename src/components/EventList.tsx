import { Header } from './Header';

type EventListProps = {
  onNavigate: (page: string) => void;
  onSelectEvent: (eventId: string) => void;
};

const events = [
  {
    id: '1',
    title: '春学期フリマ 2025',
    date: '2025年4月15日（火）',
    time: '10:00-16:00',
    location: '第一体育館',
    description: '新学期に向けて、教科書や家電など幅広い商品が出品予定です。',
    status: 'upcoming',
    itemCount: 145,
  },
  {
    id: '2',
    title: '卒業生応援フリマ',
    date: '2025年3月25日（火）',
    time: '13:00-18:00',
    location: '学生会館ホール',
    description: '卒業生の皆さんが不要になった家具・家電を格安で販売します。',
    status: 'upcoming',
    itemCount: 89,
  },
  {
    id: '3',
    title: '冬学期フリマ 2024',
    date: '2024年12月10日（火）',
    time: '10:00-16:00',
    location: '第一体育館',
    description: '年末の大掃除前に不要なものを販売しよう！',
    status: 'past',
    itemCount: 203,
  },
];

export function EventList({ onNavigate, onSelectEvent }: EventListProps) {
  const handleEventClick = (eventId: string) => {
    onSelectEvent(eventId);
    onNavigate('event-detail');
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-background">
      <Header title="イベント一覧" onNavigate={onNavigate} showBack />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-xl mb-2 text-primary">開催予定のイベント</h2>
          <p className="text-sm text-secondary">次回の学内フリマをチェックしましょう</p>
        </div>

        <div className="space-y-4">
          {events.map((event) => (
            <button
              key={event.id}
              onClick={() => handleEventClick(event.id)}
              className="w-full border border-border bg-card hover:shadow-md hover:border-primary transition-all text-left rounded-lg"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs border rounded ${
                        event.status === 'upcoming' ? 'bg-warning/20 border-warning text-foreground' : 'bg-muted border-border text-secondary'
                      }`}>
                        {event.status === 'upcoming' ? '開催予定' : '終了'}
                      </span>
                    </div>
                    <h3 className="text-xl mb-2 text-primary">{event.title}</h3>
                    <div className="space-y-1 text-sm text-foreground">
                      <p>📅 {event.date}</p>
                      <p>🕐 {event.time}</p>
                      <p>📍 {event.location}</p>
                    </div>
                  </div>
                  <div className="w-20 h-20 border border-border bg-muted flex-shrink-0 rounded"></div>
                </div>
                
                <p className="text-sm text-secondary mb-4">{event.description}</p>
                
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <span className="text-sm text-foreground">出品数：{event.itemCount}件</span>
                  <span className="text-sm text-primary">詳細を見る →</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}