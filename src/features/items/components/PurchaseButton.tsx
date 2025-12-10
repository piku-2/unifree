type PurchaseButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export function PurchaseButton({ onClick, disabled }: PurchaseButtonProps) {
  return (
    <button
        onClick={onClick}
        disabled={disabled}
        className="flex-1 py-3 border-2 border-accent bg-accent text-white rounded hover:bg-[#FF7F50] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      出品者に連絡する
    </button>
  );
}
