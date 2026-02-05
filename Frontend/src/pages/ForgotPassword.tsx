import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('forgot_password.title') || 'Recuperar Contraseña'}
        </h1>
        <p className="text-gray-600 mb-6">
          {t('forgot_password.subtitle') ||
            'Ingresa tu correo electrónico para recibir un enlace de recuperación'}
        </p>

        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {t('forgot_password.success') ||
              'Revisa tu correo para obtener el enlace de recuperación'}
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              {t('login.email') || 'Correo Electrónico'}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            {loading
              ? t('common.loading') || 'Cargando...'
              : t('forgot_password.button') || 'Enviar Enlace de Recuperación'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {t('forgot_password.remember_password') || '¿Recuerdas tu contraseña?'}{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {t('forgot_password.back_to_login') || 'Volver al Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
