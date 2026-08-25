import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

const messages = [
  'Reading the room…',
  'Searching cinematic worlds…',
  'Curating your watchlist…',
]

export function LoadingHeading() {
  const [messageIndex, setMessageIndex] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion) return
    const interval = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % messages.length)
    }, 1800)
    return () => window.clearInterval(interval)
  }, [reduceMotion])

  return (
    <span className="inline-grid overflow-hidden align-bottom">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={messageIndex}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="col-start-1 row-start-1"
        >
          {messages[messageIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
