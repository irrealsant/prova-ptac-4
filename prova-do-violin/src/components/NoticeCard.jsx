export default function NoticeCard({ notice, onEdit, onDelete, deleting }) {
  return (
    <article className="notice-card">
      <h3>{notice.title}</h3>
      <p className="notice-body">{notice.body}</p>
      <p className="notice-meta">
        post id {notice.id} · publicado pelo usuário {notice.userId}
      </p>
      <div className="card-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => onEdit(notice)}
          disabled={deleting}
        >
          Editar
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => onDelete(notice)}
          disabled={deleting}
        >
          {deleting ? 'Excluindo...' : 'Excluir'}
        </button>
      </div>
    </article>
  )
}
