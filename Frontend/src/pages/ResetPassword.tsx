import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';

export function ResetPassword() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setError(t('reset_password.invalid_link') || 'El enlace es inválido o ha expirado');
      setToken(null);
    } else {
      setToken(tokenParam);
    }
  }, [searchParams, t]);

  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    setPasswordMismatch(value !== confirmPassword && confirmPassword.length > 0);
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setPasswordMismatch(newPassword !== value && newPassword.length > 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!token) {
      setError(t('reset_password.invalid_link') || 'El enlace es inválido');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t('reset_password.passwords_mismatch') || 'Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 8) {
      setError(
        t('reset_password.password_too_short') ||
        'La contraseña debe tener al menos 8 caracteres'
      );
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword,
      });

      if (response.data.success) {
        setSuccess(true);
        setNewPassword('');
        setConfirmPassword('');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        t('reset_password.error') ||
        'Ha ocurrido un error al restablecer la contraseña'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('reset_password.title') || 'Restablecer Contraseña'}
          </h1>
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error || (t('reset_password.invalid_link') || 'El enlace es inválido o ha expirado')}
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {t('reset_password.back_to_login') || 'Volver al Login'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('reset_password.title') || 'Restablecer Contraseña'}
        </h1>
        <p className="text-gray-600 mb-6">
          {t('reset_password.subtitle') ||
            'Ingresa tu nueva contraseña para restablecer el acceso a tu cuenta'}
        </p>

        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {t('reset_password.success') ||
              'Contraseña reestablecida exitosamente. Redirigiendo al login...'}
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-2">
              {t('reset_password.new_password') || 'Nueva Contraseña'}
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder={t('reset_password.password_placeholder') || '••••••••'}
              required
              minLength={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              disabled={loading}
            />
            <p className="text-sm text-gray-500 mt-1">
              {t('reset_password.password_hint') || 'Mínimo 8 caracteres'}
            </p>
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
              {t('reset_password.confirm_password') || 'Confirmar Contraseña'}
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              placeholder={t('reset_password.password_placeholder') || '••••••••'}
              required
              minLength={8}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                passwordMismatch
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              disabled={loading}
            />
            {passwordMismatch && (
              <p className="text-sm text-red-600 mt-1">
                {t('reset_password.passwords_mismatch') || 'Las contraseñas no coinciden'}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !newPassword || !confirmPassword || passwordMismatch}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            {loading
              ? t('common.loading') || 'Cargando...'
              : t('reset_password.button') || 'Restablecer Contraseña'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {t('reset_password.remember_password') || '¿Recuerdas tu contraseña?'}{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {t('reset_password.back_to_login') || 'Volver al Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
