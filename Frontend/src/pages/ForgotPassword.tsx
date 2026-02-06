import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../lib/api';

export function ForgotPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', {
        email,
      });

      if (response.data.success) {
        setSuccess(true);
        setEmail('');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        t('forgot_password.error') ||
        'Ha ocurrido un error al procesar tu solicitud'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900 relative overflow-hidden">
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.6s ease-out;
        }
        .animate-fade-scale {
          animation: fadeInScale 0.5s ease-out;
        }
        .auth-container {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 250, 250, 0.98) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .dark .auth-container {
          background: linear-gradient(135deg, rgba(26, 40, 49, 0.95) 0%, rgba(13, 20, 28, 0.98) 100%);
          border: 1px solid rgba(50, 85, 103, 0.3);
        }
      `}</style>
      
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/training-bg.webp" 
          alt="Training background" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/70 to-primary/40"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-scale">
        <div className="auth-container rounded-2xl shadow-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
              {t('forgot_password.title') || 'Recuperar Contraseña'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
              {t('forgot_password.subtitle') || 'Ingresa tu email para recibir un enlace de recuperación'}
            </p>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-lg animate-slide-in flex items-center gap-3">
              <CheckCircle className="text-green-600 dark:text-green-400 shrink-0" size={20} />
              <p className="text-green-700 dark:text-green-300 text-sm font-semibold">
                {t('forgot_password.success') || 'Revisa tu correo para el enlace de recuperación'}
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg animate-slide-in flex items-center gap-3">
              <AlertCircle className="text-red-600 dark:text-red-400 shrink-0" size={20} />
              <p className="text-red-700 dark:text-red-300 text-sm font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1 tracking-wider">
                {t('register.email_label') || 'Correo Electrónico'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('login.email_placeholder') || 'email@example.com'}
                  required
                  disabled={loading || success}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || success}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-4 rounded-xl transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            >
              {loading
                ? (t('common.loading') || 'Cargando...')
                : (t('forgot_password.button') || 'Enviar Enlace')}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-gray-200 dark:border-gray-700/50">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {t('forgot_password.remember_password') || '¿Recuerdas tu contraseña?'}
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              {t('forgot_password.back_to_login') || 'Volver al Login'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
