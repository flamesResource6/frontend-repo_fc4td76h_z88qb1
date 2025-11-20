import Spline from '@splinetool/react-spline'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/LU2mWMPbF3Qi1Qxh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Gradient + noise overlay that doesn't block scene interactions */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/60" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-md border border-white/20">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-white/80">Vibe-powered workflows</span>
          </div>
          <h1 className="mt-6 text-5xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
            Generate todos with vibe, speed, and insane polish
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-white/80">
            Describe your day’s energy and we’ll auto-craft a micro-plan. Tap to complete, swipe the vibes, ship the day.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
