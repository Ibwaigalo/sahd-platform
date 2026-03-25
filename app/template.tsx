'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [displayChildren, setDisplayChildren] = useState(children)

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setDisplayChildren(children)
      setIsLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [pathname, children])

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-20 h-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 border-4 border-primary-900/20 rounded-full"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-1 border-4 border-t-accent-orange border-r-transparent border-b-transparent border-l-transparent rounded-full"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-2 border-4 border-t-primary-900 border-r-transparent border-b-transparent border-l-transparent rounded-full"
                />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2"
              >
                <span className="text-2xl font-black text-primary-900">SAHD</span>
                <span className="text-2xl font-light text-accent-orange">2026</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        {displayChildren}
      </motion.div>
    </>
  )
}
