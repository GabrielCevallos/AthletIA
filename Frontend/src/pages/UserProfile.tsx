import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Layout from '../components/layout/Layout'
import api from '../lib/api'
import { ArrowLeft, Calendar, Mail, User as UserIcon, Phone, FileText, Clock, Users, X } from 'lucide-react'
import Swal from 'sweetalert2'

interface UserProfileData {
  id: string
  accountId: string
  name: string
  email: string 
  role: string
  createdAt: string
  updatedAt: string
  status: string
  birthDate?: string
  age?: number
  gender?: string
  phoneNumber?: string
  fitGoals?: string[]
}

export default function UserProfile() {
  const { accountId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [profile, setProfile] = useState<UserProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    birthDate: '',
    gender: '',
    phoneNumber: '',
  })

  useEffect(() => {
    if (accountId) {
      fetchProfile(accountId)
    }
  }, [accountId])

  const fetchProfile = async (id: string) => {
    try {
      setLoading(true)
      // Assuming the endpoint is profiles/by-account/:accountId
      // Correcting the user's typo 'by-accouont' to 'by-account'
      const { data } = await api.get(`profiles/by-account/${id}`)
      console.log('👤 Perfil cargado:', data)
      setProfile(data.data || data) 
    } catch (err: any) {
      console.error('❌ Error cargando perfil:', err)
      setError(err.response?.data?.message || t('users.profile.errors.load_failed'))
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      case 'inactive': return 'bg-rose-500/10 text-rose-500 border-rose-500/20'
      case 'suspended': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  const handleEditClick = () => {
    if (profile) {
      setEditForm({
        name: profile.name || '',
        birthDate: profile.birthDate || '',
        gender: profile.gender || '',
        phoneNumber: profile.phoneNumber || '',
      })
      setIsEditModalOpen(true)
    }
  }

  const handleSaveProfile = async () => {
    try {
      if (!accountId) return
      
      await api.patch(`/profiles/${accountId}`, editForm)
      
      await Swal.fire({
        icon: 'success',
        title: t('users.profile.edit_success'),
        timer: 1500,
        showConfirmButton: false,
      })
      
      setIsEditModalOpen(false)
      fetchProfile(accountId)
    } catch (err: any) {
      console.error('Error updating profile:', err)
      await Swal.fire({
        icon: 'error',
        title: t('users.profile.edit_error'),
        text: err.response?.data?.message || t('users.profile.errors.update_failed'),
      })
    }
  }

  const handleResetPassword = async () => {
    try {
      const result = await Swal.fire({
        icon: 'warning',
        title: t('users.profile.reset_password_confirm_title'),
        text: t('users.profile.reset_password_confirm_text'),
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonText: t('common.actions.cancel'),
        confirmButtonText: t('users.profile.reset_password_confirm'),
      })

      if (result.isConfirmed && accountId) {
        await api.post(`/auth/admin-reset-password/${accountId}`)
        
        await Swal.fire({
          icon: 'success',
          title: t('users.profile.reset_password_success_title'),
          text: t('users.profile.reset_password_success_text'),
        })
      }
    } catch (err: any) {
      console.error('Error resetting password:', err)
      await Swal.fire({
        icon: 'error',
        title: t('users.profile.reset_password_error'),
        text: err.response?.data?.message || t('users.profile.errors.reset_failed'),
      })
    }
  }

  const calculateAge = (birthDate: string) => {
    // If backend provides age, use it (though specific logic might differ)
    // But usually backend calculation is more reliable regarding timezones
    return profile?.age || 'N/A' 
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    )
  }

  if (error || !profile) {
    return (
      <Layout>
        <div className="p-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>{t('users.profile.back')}</span>
          </button>
          <div className="rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 p-8 text-center max-w-2xl mx-auto">
            <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">{t('users.profile.errors.title')}</h3>
            <p className="text-gray-600 dark:text-gray-300">{error || t('users.profile.errors.not_found')}</p>
            <button 
              onClick={() => accountId && fetchProfile(accountId)}
              className="mt-6 px-4 py-2 bg-white dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
            >
              {t('users.profile.errors.retry')}
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  // Fallback for name only if it's missing (though it shouldn't be for a profile)
  const displayName = profile.name || t('users.profile.no_name')
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <Layout>
      <div className="max-w-5xl mx-auto pb-12">
        {/* Header Navigation */}
        <div className="mb-6 sm:mb-8">
          <button 
            onClick={() => navigate('/users')}
            className="flex items-center gap-2 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors group"
          >
            <div className="p-2 rounded-full bg-transparent group-hover:bg-gray-100 dark:group-hover:bg-[#233c48] transition-colors">
              <ArrowLeft size={20} />
            </div>
            <span className="font-medium">{t('users.profile.back_to_list')}</span>
          </button>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white dark:bg-[#1a2831] rounded-2xl p-6 sm:p-8 shadow-card-md border border-gray-100 dark:border-[#325567] mb-6 relative overflow-hidden">
          {/* Decorative background accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            {/* Avatar Circle */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center border-4 border-white dark:border-[#1a2831] shadow-lg shrink-0">
              <span className="text-4xl sm:text-5xl font-black text-primary select-none">
                {initial}
              </span>
            </div>

            {/* Main Info */}
            <div className="flex-1 text-center sm:text-left pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2 justify-center sm:justify-start">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {displayName}
                </h1>
                {profile.status && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(profile.status)}`}>
                    {t(`users.table.status.${profile.status.toLowerCase()}`, { defaultValue: profile.status })}
                  </span>
                )}
                {profile.role && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 capitalize">
                    {t(`users.table.role.${profile.role.toLowerCase()}`, { defaultValue: profile.role })}
                  </span>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 text-gray-500 dark:text-[#92b7c9]">
                 <span className="flex items-center gap-2">
                    <Mail size={16} />
                    {profile.email || t('users.profile.no_email')}
                 </span>
                 {profile.phoneNumber && (
                    <span className="flex items-center gap-2">
                      <Phone size={16} />
                      {profile.phoneNumber}
                    </span>
                 )}
              </div>

              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                <button 
                  onClick={handleEditClick}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm shadow-sm hover:shadow active:scale-95 transform duration-100"
                >
                  {t('users.profile.edit')}
                </button>
                <button 
                  onClick={handleResetPassword}
                  className="px-4 py-2 bg-white dark:bg-transparent border border-gray-200 dark:border-[#325567] text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-[#233c48] transition-colors font-medium text-sm"
                >
                  {t('users.profile.reset_password')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* General Information */}
          <div className="bg-white dark:bg-[#1a2831] rounded-2xl p-6 shadow-card-md border border-gray-100 dark:border-[#325567]">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <UserIcon size={20} className="text-primary" />
              {t('users.profile.personal_info')}
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-[#233c48]">
                <span className="text-gray-500 dark:text-[#92b7c9] text-sm">{t('users.profile.gender')}</span>
                <span className="text-gray-900 dark:text-white font-medium capitalize">
                  {profile.gender || t('users.profile.not_specified')}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-[#233c48]">
                <span className="text-gray-500 dark:text-[#92b7c9] text-sm">{t('users.profile.birthdate')}</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {profile.birthDate ? new Date(profile.birthDate).toLocaleDateString() : t('users.profile.not_defined')}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-[#233c48]">
                <span className="text-gray-500 dark:text-[#92b7c9] text-sm">{t('users.profile.age')}</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {profile.age || (profile.birthDate ? calculateAge(profile.birthDate) : '-')} {t('users.profile.years')}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-[#233c48]">
                <span className="text-gray-500 dark:text-[#92b7c9] text-sm">{t('users.profile.phone')}</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {profile.phoneNumber || '-'}
                </span>
              </div>
               <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-[#233c48]">
                <span className="text-gray-500 dark:text-[#92b7c9] text-sm">{t('users.profile.member_since')}</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '-'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-[#233c48]">
                <span className="text-gray-500 dark:text-[#92b7c9] text-sm">{t('users.profile.last_updated')}</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Fitness Goals */}
          <div className="bg-white dark:bg-[#1a2831] rounded-2xl p-6 shadow-card-md border border-gray-100 dark:border-[#325567]">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText size={20} className="text-primary" />
              {t('users.profile.fitness_goals')}
            </h2>
            {profile.fitGoals && profile.fitGoals.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.fitGoals.map((goal, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-[#233c48] text-gray-700 dark:text-gray-300 text-sm font-medium capitalize"
                  >
                    {goal.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                 <div className="w-16 h-16 bg-gray-50 dark:bg-[#233c48] rounded-full flex items-center justify-center mx-auto mb-3">
                   <Clock size={24} className="text-gray-400 dark:text-gray-500" />
                 </div>
                 <p className="text-gray-500 dark:text-[#92b7c9] text-sm">
                   {t('users.profile.no_goals')}
                 </p>
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-[#233c48]">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Users size={16} className="text-primary" />
                {t('users.profile.groups_trainers')}
              </h3>
               <p className="text-gray-500 dark:text-[#92b7c9] text-sm">
                   {t('users.profile.no_assignments')}
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1a2831] rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-200 dark:border-[#325567] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('users.profile.edit')}</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-[#233c48] rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('users.profile.name')}
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-[#325567] bg-white dark:bg-[#233c48] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('users.profile.birthdate')}
                </label>
                <input
                  type="date"
                  value={editForm.birthDate}
                  onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-[#325567] bg-white dark:bg-[#233c48] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('users.profile.gender')}
                </label>
                <select
                  value={editForm.gender}
                  onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-[#325567] bg-white dark:bg-[#233c48] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="">{t('users.profile.select_gender')}</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('users.profile.phone')}
                </label>
                <input
                  type="tel"
                  value={editForm.phoneNumber}
                  onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-[#325567] bg-white dark:bg-[#233c48] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="0000000000"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-[#325567] text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-[#233c48] transition-colors font-medium"
              >
                {t('common.actions.cancel')}
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                {t('common.actions.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
