import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccessibility } from '../context/AccessibilityContext'

export default function AccessibilityButton() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const {
    textSize,
    grayscale,
    highContrast,
    negativeContrast,
    readableFont,
    underlineLinks,
    readingSpeed,
    isReading,
    increaseTextSize,
    decreaseTextSize,
    toggleGrayscale,
    toggleHighContrast,
    toggleNegativeContrast,
    toggleReadableFont,
    toggleUnderlineLinks,
    setReadingSpeed,
    readPage,
    stopReading,
    resetSettings,
  } = useAccessibility()

  const readingSpeeds = [
    { label: t('accessibility.speed.slow'), value: 0.8 },
    { label: t('accessibility.speed.normal'), value: 1.0 },
    { label: t('accessibility.speed.fast'), value: 1.2 },
    { label: t('accessibility.speed.very_fast'), value: 1.4 },
  ]

  return (
    <>
      {/* Botón flotante principal - responsivo */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/50 transition-all flex items-center justify-center"
        aria-label={t('accessibility.open_menu')}
        aria-expanded={isOpen}
      >
        <span className="material-symbols-outlined text-xl sm:text-2xl">accessibility</span>
      </button>

      {/* Panel de accesibilidad */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Panel - responsivo */}
          <div className="fixed bottom-20 sm:bottom-24 right-2 sm:right-6 z-50 w-[calc(100vw-1rem)] sm:w-80 md:w-96 max-h-[70vh] sm:max-h-[75vh] md:max-h-[80vh] bg-white dark:bg-[#1a2831] rounded-xl shadow-2xl border border-gray-200 dark:border-[#325567] flex flex-col overflow-hidden">
            <div className="sticky top-0 bg-white dark:bg-[#1a2831] border-b border-gray-200 dark:border-[#325567] p-4 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {t('accessibility.title')}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300"
                aria-label={t('accessibility.close_menu')}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              {/* Tamaño de texto */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                  {t('accessibility.text_size')} ({textSize}%)
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={decreaseTextSize}
                    disabled={textSize <= 100}
                    className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#233c48] text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-[#2d4a5a] disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                    aria-label={t('accessibility.decrease_text_size')}
                  >
                    <span className="material-symbols-outlined text-xl">text_decrease</span>
                    <span className="ml-1">A-</span>
                  </button>
                  <button
                    onClick={increaseTextSize}
                    disabled={textSize >= 140}
                    className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#233c48] text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-[#2d4a5a] disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                    aria-label={t('accessibility.increase_text_size')}
                  >
                    <span className="material-symbols-outlined text-xl">text_increase</span>
                    <span className="ml-1">A+</span>
                  </button>
                </div>
              </div>

              {/* Opciones de contraste */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                  {t('accessibility.contrast_color')}
                </label>
                <div className="space-y-2">
                  <ToggleOption
                    label={t('accessibility.grayscale')}
                    checked={grayscale}
                    onChange={toggleGrayscale}
                    icon="filter_b_and_w"
                  />
                  <ToggleOption
                    label={t('accessibility.high_contrast')}
                    checked={highContrast}
                    onChange={toggleHighContrast}
                    icon="contrast"
                  />
                  <ToggleOption
                    label={t('accessibility.negative_contrast')}
                    checked={negativeContrast}
                    onChange={toggleNegativeContrast}
                    icon="invert_colors"
                  />
                </div>
              </div>

              {/* Opciones de lectura */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                  {t('accessibility.readability')}
                </label>
                <div className="space-y-2">
                  <ToggleOption
                    label={t('accessibility.readable_font')}
                    checked={readableFont}
                    onChange={toggleReadableFont}
                    icon="font_download"
                  />
                  <ToggleOption
                    label={t('accessibility.underline_links')}
                    checked={underlineLinks}
                    onChange={toggleUnderlineLinks}
                    icon="link"
                  />
                </div>
              </div>

              {/* Lector de pantalla */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                  {t('accessibility.screen_reader')}
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={isReading ? stopReading : readPage}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 ${
                        isReading
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-primary hover:bg-primary/90 text-white'
                      }`}
                      aria-label={isReading ? t('accessibility.stop') : t('accessibility.read_page')}
                    >
                      <span className="material-symbols-outlined">
                        {isReading ? 'stop' : 'volume_up'}
                      </span>
                      {isReading ? t('accessibility.stop') : t('accessibility.read_page')}
                    </button>
                  </div>

                  {/* Velocidad de lectura */}
                  <div className="space-y-1">
                    <label className="block text-xs text-gray-600 dark:text-gray-400">
                      {t('accessibility.reading_speed')}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {readingSpeeds.map((speed) => (
                        <button
                          key={speed.value}
                          onClick={() => setReadingSpeed(speed.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                            readingSpeed === speed.value
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 dark:bg-[#233c48] text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-[#2d4a5a]'
                          }`}
                          aria-label={`${t('accessibility.reading_speed')} ${speed.label}`}
                          aria-pressed={readingSpeed === speed.value}
                        >
                          {speed.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón de restablecer */}
              <button
                onClick={resetSettings}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#233c48] text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-[#2d4a5a] font-medium text-sm flex items-center justify-center gap-2"
                aria-label={t('accessibility.reset_label')}
              >
                <span className="material-symbols-outlined">restart_alt</span>
                {t('accessibility.reset')}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

// Componente auxiliar para opciones de toggle
function ToggleOption({
  label,
  checked,
  onChange,
  icon,
}: {
  label: string
  checked: boolean
  onChange: () => void
  icon: string
}) {
  return (
    <button
      onClick={onChange}
      className={`w-full flex items-center justify-between p-3 rounded-lg transition ${
        checked
          ? 'bg-primary text-white'
          : 'bg-gray-100 dark:bg-[#233c48] text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-[#2d4a5a]'
      }`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
    >
      <span className="flex items-center gap-2 text-sm font-medium">
        <span className="material-symbols-outlined text-xl">{icon}</span>
        {label}
      </span>
      <span className={`w-10 h-5 rounded-full transition ${
        checked ? 'bg-white/30' : 'bg-gray-300 dark:bg-[#1a2831]'
      } relative`}>
        <span className={`absolute top-0.5 ${
          checked ? 'right-0.5' : 'left-0.5'
        } w-4 h-4 rounded-full transition ${
          checked ? 'bg-white' : 'bg-white dark:bg-gray-400'
        }`} />
      </span>
    </button>
  )
}
