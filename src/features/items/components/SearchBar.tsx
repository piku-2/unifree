type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="キーワードで検索"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 pr-12 border border-border bg-card rounded focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 border-2 border-primary rounded-full"></div>
    </div>
  );
}
