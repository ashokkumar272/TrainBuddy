import React from 'react'
import Hero from '../components/Hero'
import { Navbar } from '../components/layout'

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-primary-50/30 to-surface-50 relative overflow-hidden">
      {/* Subtle decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 -left-32 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-32 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl" />
      </div>

      <Navbar />
      <div className="min-h-screen flex items-start lg:items-center justify-center pt-20 lg:pt-16">
        <Hero />
      </div>
    </div>
  )
}

export default Home