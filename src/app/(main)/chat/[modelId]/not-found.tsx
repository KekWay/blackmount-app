export default function ChatNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-xl font-medium text-foreground">Модель не найдена</h2>
      <p className="text-sm text-muted-foreground">Такой модели не существует на платформе.</p>
      <a
        href="/"
        className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
      >
        На главную
      </a>
    </div>
  )
}
