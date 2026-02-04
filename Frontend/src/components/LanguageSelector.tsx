import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { LANGUAGES } from '../i18n';

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const { isAuthenticated } = useAuth();

  const handleLanguageChange = async (langCode: string) => {
    // 1. Cambiar idioma localmente inmediatamente
    await i18n.changeLanguage(langCode);

    // 2. Si está autenticado, guardar en backend
    if (isAuthenticated) {
      try {
        const apiValue = LANGUAGES[langCode as keyof typeof LANGUAGES].apiValue;
        // Endpoint PATCH /profiles actualiza el perfil del usuario autenticado
        await api.patch('/profiles', { language: apiValue });
        console.log(`Idioma actualizado en backend a: ${apiValue}`);
      } catch (error) {
        console.error("Failed to save language preference", error);
      }
    }
  };

  return (
    <div className="flex gap-2 items-center">
      {Object.keys(LANGUAGES).map((code) => (
        <button
          key={code}
          onClick={() => handleLanguageChange(code)}
          className={`px-2 py-1 rounded text-xs sm:text-sm font-medium transition-colors ${
            i18n.language.startsWith(code)
              ? 'bg-primary text-white dark:bg-primary-dark'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          title={LANGUAGES[code as keyof typeof LANGUAGES].label}
          aria-label={`Switch to ${LANGUAGES[code as keyof typeof LANGUAGES].label}`}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
