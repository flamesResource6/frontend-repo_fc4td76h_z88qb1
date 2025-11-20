import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Plus, Trash2, Check, Flame, Wand2, Rocket } from 'lucide-react'

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

const vibePresets = [
  { key: 'study', label: 'Study Sesh', color: 'from-violet-500 to-fuchsia-500' },
  { key: 'gym', label: 'Gym Grind', color: 'from-emerald-500 to-lime-500' },
  { key: 'reset', label: 'Reset Day', color: 'from-cyan-500 to-blue-500' },
  { key: 'deep work', label: 'Deep Work', color: 'from-amber-500 to-orange-600' },
  { key: 'errands', label: 'Errands', color: 'from-pink-500 to-rose-500' },
  { key: 'content', label: 'Content', color: 'from-sky-500 to-indigo-500' },
]

export default function Generator() {
  const [prompt, setPrompt] = useState('Crush my finals week')
  const [vibe, setVibe] = useState('study')
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  const gradient = useMemo(() => vibePresets.find(v => v.key === vibe)?.color || 'from-blue-500 to-purple-500', [vibe])

  const fetchTodos = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${baseUrl}/api/todos/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, vibe, count: 6 })
      })
      if (!res.ok) throw new Error('Failed to generate')
      const data = await res.json()
      setItems(prev => [...data.items, ...prev])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleComplete = async (id, completed) => {
    try {
      const res = await fetch(`${baseUrl}/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
      })
      if (res.ok) {
        const updated = await res.json()
        setItems(prev => prev.map(i => i.id === id ? updated : i))
      }
    } catch {}
  }

  const removeItem = async (id) => {
    try {
      const res = await fetch(`${baseUrl}/api/todos/${id}`, { method: 'DELETE' })
      if (res.ok) setItems(prev => prev.filter(i => i.id !== id))
    } catch {}
  }

  useEffect(() => {
    // Load existing todos on mount
    ;(async () => {
      try {
        const res = await fetch(`${baseUrl}/api/todos`)
        if (res.ok) {
          const data = await res.json()
          setItems(data)
        }
      } catch {}
    })()
  }, [])

  return (
    <section className="relative py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <div className={`rounded-2xl p-6 bg-gradient-to-br ${gradient} text-white shadow-lg`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <p className="text-sm opacity-90">Vibe generator</p>
              </div>
              <h3 className="mt-2 text-2xl font-bold">What are we on today?</h3>
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your day..."
                className="mt-4 w-full rounded-xl bg-white/15 placeholder-white/50 px-4 py-3 outline-none border border-white/20 focus:border-white/40"
              />

              <div className="mt-4 flex flex-wrap gap-2">
                {vibePresets.map(v => (
                  <button
                    key={v.key}
                    onClick={() => setVibe(v.key)}
                    className={`px-3 py-1.5 rounded-full text-sm backdrop-blur border ${vibe === v.key ? 'bg-white text-black border-white' : 'bg-white/10 text-white border-white/30 hover:bg-white/20'}`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>

              <button
                onClick={fetchTodos}
                disabled={loading}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black/90 hover:bg-black text-white px-4 py-2 transition disabled:opacity-60"
              >
                <Wand2 className="h-4 w-4" />
                {loading ? 'Generating…' : 'Generate list'}
              </button>

              {error && <p className="mt-3 text-sm text-black/90 bg-white/80 rounded-lg px-3 py-2">{error}</p>}
            </div>
          </motion.div>

          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4"
            >
              <div className="flex items-center justify-between px-2 py-2">
                <div className="flex items-center gap-2 text-white/80">
                  <Flame className="h-5 w-5 text-orange-400" />
                  <span className="font-semibold">Your micro-plan</span>
                </div>
                <div className="text-xs text-white/60">Tap to complete</div>
              </div>

              <ul className="divide-y divide-white/10">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between gap-3 px-3 py-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => toggleComplete(item.id, !item.completed)}
                          className={`h-6 w-6 rounded-full border flex items-center justify-center ${item.completed ? 'bg-emerald-500 border-emerald-500' : 'border-white/30'} transition`}
                          aria-label="toggle complete"
                        >
                          {item.completed && <Check className="h-4 w-4 text-white" />}
                        </button>
                        <div className="min-w-0">
                          <p className={`truncate text-white ${item.completed ? 'line-through opacity-60' : ''}`}>{item.title}</p>
                          <p className="text-xs text-white/50">{item.vibe || 'freestyle'} • {item.priority}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs rounded-full px-2 py-1 ${
                          item.priority === 'high' ? 'bg-red-500/20 text-red-300' : item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>{item.priority}</span>
                        <button onClick={() => removeItem(item.id)} className="p-2 hover:bg-white/10 rounded-lg">
                          <Trash2 className="h-4 w-4 text-white/70" />
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>

              {items.length === 0 && (
                <div className="px-3 py-10 text-center text-white/60">
                  <Rocket className="mx-auto mb-2 h-6 w-6" />
                  <p>Nothing here yet. Generate a plan to kick things off.</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
