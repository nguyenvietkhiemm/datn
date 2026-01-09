export default function EmptyState({ text }: { text: string }) {
    return (
        <div style={{ padding: 24, textAlign: "start", color: "#64748b" }}>
            {text}
        </div>
    );
}
