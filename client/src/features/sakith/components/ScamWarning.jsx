export default function ScamWarning({ text }) {
  if (!text) return null;

  const t = text.toLowerCase();

  if (t.includes("advance payment") || t.includes("send money")) {
    return <p style={{ color: "var(--error)" }}>⚠️ Scam Warning</p>;
  }

  return null;
}