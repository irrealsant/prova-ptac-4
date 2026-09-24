import { useState, useEffect } from 'react'
import NoticeForm from './components/NoticeForm.jsx'
import NoticeList from './components/NoticeList.jsx'
import './App.css'

const API_BASE = 'https://jsonplaceholder.typicode.com'
const CURRENT_USER = 1

export default function App() {
  const [notices, setNotices] = useState([])
  const [loadingInitial, setLoadingInitial] = useState(true)
  const [loadError, setLoadError] = useState(null)

  const [editingNotice, setEditingNotice] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadNotices() {
      setLoadingInitial(true)
      setLoadError(null)
      try {
        const response = await fetch(`${API_BASE}/posts?_limit=15`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error(`status ${response.status}`)
        const data = await response.json()
        setNotices(data)
      } catch (err) {
        if (err.name === 'AbortError') return
        setLoadError('Não foi possível conectar à API (Network Error). Tente novamente.')
      } finally {
        setLoadingInitial(false)
      }
    }

    loadNotices()
    return () => controller.abort()
  }, [])

  async function createNotice({ title, body }) {
    setSubmitting(true)
    setLoadError(null)
    try {
      const response = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: CURRENT_USER, title, body }),
      })
      if (!response.ok) throw new Error(`status ${response.status}`)
      const created = await response.json()

      const idExists = notices.some((notice) => notice.id === created.id)
      const newNotice = {
        userId: created.userId ?? CURRENT_USER,
        id: idExists ? Date.now() : created.id,
        title: created.title ?? title,
        body: created.body ?? body,
      }

      setNotices((current) => [newNotice, ...current])
    } catch (err) {
      setLoadError('Não foi possível publicar o aviso (Network Error). Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  async function updateNotice(updatedNotice) {
    setSubmitting(true)
    setLoadError(null)
    try {
      const response = await fetch(`${API_BASE}/posts/${updatedNotice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNotice),
      })
      if (!response.ok) throw new Error(`status ${response.status}`)

      setNotices((current) =>
        current.map((notice) => (notice.id === updatedNotice.id ? updatedNotice : notice))
      )
      setEditingNotice(null)
    } catch (err) {
      setLoadError('Não foi possível salvar as alterações (Network Error). Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  async function deleteNotice(notice) {
    setDeletingId(notice.id)
    setLoadError(null)

    setNotices((current) => current.filter((item) => item.id !== notice.id))

    try {
      const response = await fetch(`${API_BASE}/posts/${notice.id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error(`status ${response.status}`)
    } catch (err) {
      setNotices((current) => {
        const position = current.findIndex((item) => item.id > notice.id)
        if (position === -1) return [...current, notice]
        const copy = [...current]
        copy.splice(position, 0, notice)
        return copy
      })
      setLoadError('Não foi possível excluir o aviso (Network Error). Tente novamente.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Mural de Avisos</h1>
        <p>Projeto P2 — PTAC4 · avisos e recados da turma</p>
      </header>

      <main className="page-content">
        <NoticeForm
          editingNotice={editingNotice}
          onCreate={createNotice}
          onUpdate={updateNotice}
          onCancelEdit={() => setEditingNotice(null)}
          submitting={submitting}
        />

        <NoticeList
          notices={notices}
          loading={loadingInitial}
          error={loadError}
          onEdit={setEditingNotice}
          onDelete={deleteNotice}
          deletingId={deletingId}
        />
      </main>

      <footer className="page-footer">
        Vite + React · fetch GET/POST/PUT/DELETE · jsonplaceholder.typicode.com/posts
      </footer>
    </div>
  )
}
