import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axiosInstance, { isAuthenticated } from '../utils/axios'

const ProfileSetup = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    profession: '',
    bio: '',
    travelStatus: {
      boardingStation: '',
      destinationStation: '',
      travelDate: null,
      isActive: false
    }
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login')
    }
  }, [navigate])

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' 
      ? e.target.checked 
      : e.target.value
    
    setFormData({
      ...formData,
      [e.target.id]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const requiredFields = ['name', 'age', 'profession', 'bio']
      for (const field of requiredFields) {
        if (!formData[field]) {
          setError(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`)
          setLoading(false)
          return
        }
      }
      
      if (formData.bio.length > 200) {
        setError('Bio must be 200 characters or less')
        setLoading(false)
        return
      }
      
      const ageNumber = Number(formData.age)
      if (isNaN(ageNumber) || ageNumber <= 0) {
        setError('Please enter a valid age')
        setLoading(false)
        return
      }

      const profileData = {
        ...formData,
        age: ageNumber,
        profileCompleted: true
      }

      const response = await axiosInstance.put('/api/users/profile', profileData)
      
      if (response.data.success) {
        navigate('/')
      }
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'An error occurred. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all"

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-900 via-surface-800 to-surface-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white">
            Train<span className="text-primary-400">Buddy</span>
          </span>
        </Link>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-7 shadow-2xl">
          <h2 className="text-white text-xl font-bold mb-1 text-center">
            Complete Your Profile
          </h2>
          <p className="text-white/40 text-sm text-center mb-6">
            Tell us more about yourself to find travel buddies
          </p>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-4 text-sm">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-white/70 mb-1.5 text-xs font-medium" htmlFor="name">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-white/70 mb-1.5 text-xs font-medium" htmlFor="age">
                Age
              </label>
              <input
                type="number"
                id="age"
                value={formData.age}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter your age"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-white/70 mb-1.5 text-xs font-medium" htmlFor="profession">
                Profession
              </label>
              <input
                type="text"
                id="profession"
                value={formData.profession}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter your profession"
                required
              />
            </div>

            <div>
              <label className="block text-white/70 mb-1.5 text-xs font-medium" htmlFor="bio">
                Bio <span className="text-white/30">(max 200 characters)</span>
              </label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={handleChange}
                className={`${inputClass} resize-none`}
                placeholder="Tell us about yourself"
                maxLength={200}
                rows={3}
                required
              />
              <p className="text-[10px] text-white/30 mt-1 text-right">
                {formData.bio.length}/200
              </p>
            </div>

            <p className="text-xs text-white/30">
              You can set your travel status after completing your profile.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 shadow-lg shadow-primary-600/25"
            >
              {loading ? 'Saving...' : 'Complete Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfileSetup 