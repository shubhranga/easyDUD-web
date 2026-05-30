export function ResultsHeader({
  count,
  sort,
  onSort,
}: {
  count: number;
  sort: string;
  onSort: (s: string) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: 28,
            color: "#0f172a",
            letterSpacing: "-0.01em",
          }}
        >
          {count} stays available
        </h2>
        <p
          style={{
            margin: "4px 0 0",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            color: "#64748b",
          }}
        >
          Curated by our travel experts
        </p>
      </div>
      <label
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "#fff",
          border: "1px solid rgba(15,23,42,0.08)",
          borderRadius: 14,
          padding: "8px 12px",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          color: "#0f172a",
        }}
      >
        Sort by
        <select
          value={sort}
          onChange={(e) => onSort(e.target.value)}
          style={{
            border: "none",
            background: "transparent",
            outline: "none",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            color: "#0f172a",
            cursor: "pointer",
          }}
        >
          <option value="recommended">Recommended</option>
          <option value="price-asc">Price: low → high</option>
          <option value="price-desc">Price: high → low</option>
          <option value="rating">Top rated</option>
        </select>
      </label>
    </div>
  );
}
