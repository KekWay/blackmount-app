export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-3.5 px-5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 rounded-full bg-white/40 animate-pulse"
          style={{ animationDelay: `${i * 200}ms` }}
        />
      ))}
    </div>
  )
}
