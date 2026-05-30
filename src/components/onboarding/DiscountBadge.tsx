interface Props {
  percent: number;
}

export function DiscountBadge({ percent }: Props) {
  return (
    <span className="absolute right-4 top-4 inline-flex items-center rounded-full bg-rose-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-md">
      {percent}% OFF
    </span>
  );
}
