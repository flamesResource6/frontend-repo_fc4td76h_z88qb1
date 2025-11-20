import Hero from './components/Hero'
import Generator from './components/Generator'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* subtle background pattern */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(60rem_60rem_at_top,rgba(56,189,248,0.08),transparent_60%),radial-gradient(40rem_40rem_at_bottom_right,rgba(168,85,247,0.06),transparent_60%)]" />

      <Hero />
      <Generator />
      <Footer />
    </div>
  )
}

export default App
