import { useState, useEffect } from 'react'

export default function NoticeForm({
  editingNotice,
  onCreate,
  onUpdate,
  onCancelEdit,
  submitting,
}) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState('')

  const isEditing = Boolean(editingNotice)

  useEffect(() => {
    if (editingNotice) {
      setTitle(editingNotice.title)
      setBody(editingNotice.body)
      setError('')
    }
  }, [editingNotice])

  function resetForm() {
    setTitle('')
    setBody('')
    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!title.trim() || !body.trim()) {
      setError('preencha o título e o texto antes de publicar')
      return
    }
    setError('')

    if (isEditing) {
      onUpdate({ ...editingNotice, title: title.trim(), body: body.trim() })
    } else {
      onCreate({ title: title.trim(), body: body.trim() })
      resetForm()
    }
  }

  function handleCancel() {
    resetForm()
    onCancelEdit()
  }

  return (
    <section className="form-panel">
      <h2>{isEditing ? 'Editar aviso' : 'Novo aviso'}</h2>

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="title-field">Título</label>
        <input
          id="title-field"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Insira seu título"
          disabled={submitting}
        />

        <label htmlFor="body-field">Texto do aviso</label>
        <textarea
          id="body-field"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Escreva os detalhes do aviso..."
          rows={5}
          disabled={submitting}
        />

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {isEditing ? 'Salvar' : 'Publicar aviso'}
          </button>
          {isEditing && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  )
}
