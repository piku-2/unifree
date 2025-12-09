import { Header } from './Header';

type EventDetailProps = {
  eventId: string;
  onNavigate: (page: string) => void;
  onSelectItem: (itemId: string) => void;
};

const eventDetails = {
  '1': {
    title: '春学期フリマ 2025',
    date: '2025年4月15日（火）',
    time: '10:00-16:00',
    location: '第一体育館',
    description: '新学期に向けて、教科書や家電など幅広い商品が出品予定です。春から一人暮らしを始める方にもおすすめです。',
    notes: [
      '入場無料・事前登録不要',
      '現金のみの取引となります',
      '大型商品の配送手配も可能です',
      '学生証の提示が必要です',
    ],
    items: [
      { id: '1', title: 'ノートパソコン ThinkPad', price: 25000, category: '家電', seller: '田中太郎' },
      { id: '2', title: '経済学の教科書セット', price: 3000, category: '本', seller: '佐藤花子' },
      { id: '3', title: '一人暮らし用冷蔵庫', price: 8000, category: '家電', seller: '鈴木一郎' },
      { id: '4', title: 'IKEA デスク', price: 5000, category: '大型家具', seller: '山田美咲' },
      { id: '5', title: 'コーヒーメーカー', price: 2000, category: '生活雑貨', seller: '中村健太' },
      { id: '6', title: '電子レンジ', price: 4000, category: '家電', seller: '小林さくら' },
    ],
  },
};

export function EventDetail({ eventId, onNavigate, onSelectItem }: EventDetailProps) {
  const event = eventDetails[eventId as keyof typeof eventDetails] || eventDetails['1'];

  const handleItemClick = (itemId: string) => {
    onSelectItem(itemId);
    onNavigate('item-detail');
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-background">
      <Header title="イベント詳細" onNavigate={onNavigate} showBack />
      
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Event Info */}
        <section className="border border-border bg-card p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <span className="inline-block px-2 py-1 text-xs border border-warning bg-warning/20 rounded mb-3 text-foreground">
                開催予定
              </span>
              <h2 className="text-2xl mb-4 text-primary">{event.title}</h2>
            </div>
            <div className="w-24 h-24 border border-border bg-muted flex-shrink-0 rounded"></div>
          </div>
          
          <div className="space-y-2 mb-4 text-foreground">
            <p>📅 {event.date}</p>
            <p>🕐 {event.time}</p>
            <p>📍 {event.location}</p>
          </div>
          
          <p className="text-sm mb-6 text-secondary">{event.description}</p>
          
          <div className="border-t border-border pt-4">
            <h4 className="mb-2 text-primary">注意事項</h4>
            <ul className="space-y-1 text-sm text-secondary">
              {event.notes.map((note, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span>・</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Items List */}
        <section>
          <h3 className="mb-4 text-primary">このイベントの出品（{event.items.length}件）</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {event.items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className="border border-border bg-card hover:shadow-md transition-all text-left rounded-lg overflow-hidden"
              >
                <div className="w-full h-48 border-b border-border bg-muted flex items-center justify-center">
                  <div className="w-20 h-20 border-2 border-primary/30 rounded"></div>
                </div>
                <div className="p-4">
                  <p className="text-xs mb-1 text-secondary">{item.category}</p>
                  <h4 className="mb-2 text-foreground">{item.title}</h4>
                  <p className="text-xl mb-2 text-accent">¥{item.price.toLocaleString()}</p>
                  <div className="flex items-center gap-2 text-xs text-secondary">
                    <div className="w-5 h-5 border border-border rounded-full bg-muted"></div>
                    <span>{item.seller}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}