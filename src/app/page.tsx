import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ padding: "2rem", maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
        District Office – Constituent Intake & Case Tracking
      </h1>
      <p style={{ color: "#444", marginBottom: "2rem" }}>
        Bilingual (English / বাংলা) intake form and case management for district office use.
      </p>
      <nav style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <Link
          href="/intake"
          style={{
            display: "block",
            padding: "0.75rem 1rem",
            background: "#1a365d",
            color: "#fff",
            textDecoration: "none",
            borderRadius: 4,
          }}
        >
          New Intake
        </Link>
        <Link
          href="/dashboard"
          style={{
            display: "block",
            padding: "0.75rem 1rem",
            background: "#2d3748",
            color: "#fff",
            textDecoration: "none",
            borderRadius: 4,
          }}
        >
          Case Dashboard
        </Link>
      </nav>
    </div>
  );
}
