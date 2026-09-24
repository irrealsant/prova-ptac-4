import NoticeCard from './NoticeCard.jsx'

export default function NoticeList({
  notices,
  loading,
  error,
  onEdit,
  onDelete,
  deletingId,
}) {
  return (
    <section className="list-panel">
      <h2>Avisos publicados ({notices.length})</h2>

      {notices.length === 0 && !loading && !error && (
        <p className="empty-message">
          Nenhum aviso publicado — seja a primeira pessoa a escrever no mural.
        </p>
      )}

      <div className="notice-grid">
        {notices.map((notice) => (
          <NoticeCard
            key={notice.id}
            notice={notice}
            onEdit={onEdit}
            onDelete={onDelete}
            deleting={deletingId === notice.id}
          />
        ))}
      </div>

      {loading && (
        <p className="loading-message">
          <span className="spinner" />
          Carregando avisos...
        </p>
      )}

      {error && <p className="error-message">{error}</p>}
    </section>
  )
}
