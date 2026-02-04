import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface AccessibilitySettings {
  textSize: number // 100, 110, 120, 130, 140
  grayscale: boolean
  highContrast: boolean
  negativeContrast: boolean
  readableFont: boolean
  underlineLinks: boolean
  readingSpeed: number // 0.8, 1.0, 1.2, 1.4
}

interface AccessibilityContextType extends AccessibilitySettings {
  increaseTextSize: () => void
  decreaseTextSize: () => void
  toggleGrayscale: () => void
  toggleHighContrast: () => void
  toggleNegativeContrast: () => void
  toggleReadableFont: () => void
  toggleUnderlineLinks: () => void
  setReadingSpeed: (speed: number) => void
  readPage: () => void
  stopReading: () => void
  resetSettings: () => void
  isReading: boolean
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

const defaultSettings: AccessibilitySettings = {
  textSize: 100,
  grayscale: false,
  highContrast: false,
  negativeContrast: false,
  readableFont: false,
  underlineLinks: false,
  readingSpeed: 1.0,
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('accessibility-settings')
    return saved ? JSON.parse(saved) : defaultSettings
  })
  const [isReading, setIsReading] = useState(false)
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings))
    applySettings()
  }, [settings])

  const applySettings = () => {
    const root = document.documentElement

    // Text size
    root.style.fontSize = `${settings.textSize}%`

    // Grayscale
    if (settings.grayscale) {
      root.classList.add('accessibility-grayscale')
    } else {
      root.classList.remove('accessibility-grayscale')
    }

    // High contrast
    if (settings.highContrast) {
      root.classList.add('accessibility-high-contrast')
    } else {
      root.classList.remove('accessibility-high-contrast')
    }

    // Negative contrast
    if (settings.negativeContrast) {
      root.classList.add('accessibility-negative-contrast')
    } else {
      root.classList.remove('accessibility-negative-contrast')
    }

    // Readable font
    if (settings.readableFont) {
      root.classList.add('accessibility-readable-font')
    } else {
      root.classList.remove('accessibility-readable-font')
    }

    // Underline links
    if (settings.underlineLinks) {
      root.classList.add('accessibility-underline-links')
    } else {
      root.classList.remove('accessibility-underline-links')
    }
  }

  const increaseTextSize = () => {
    setSettings(prev => ({
      ...prev,
      textSize: Math.min(prev.textSize + 10, 140)
    }))
  }

  const decreaseTextSize = () => {
    setSettings(prev => ({
      ...prev,
      textSize: Math.max(prev.textSize - 10, 100)
    }))
  }

  const toggleGrayscale = () => {
    setSettings(prev => ({ ...prev, grayscale: !prev.grayscale }))
  }

  const toggleHighContrast = () => {
    setSettings(prev => ({ 
      ...prev, 
      highContrast: !prev.highContrast,
      negativeContrast: false // Disable negative contrast when enabling high contrast
    }))
  }

  const toggleNegativeContrast = () => {
    setSettings(prev => ({ 
      ...prev, 
      negativeContrast: !prev.negativeContrast,
      highContrast: false // Disable high contrast when enabling negative contrast
    }))
  }

  const toggleReadableFont = () => {
    setSettings(prev => ({ ...prev, readableFont: !prev.readableFont }))
  }

  const toggleUnderlineLinks = () => {
    setSettings(prev => ({ ...prev, underlineLinks: !prev.underlineLinks }))
  }

  const setReadingSpeed = (speed: number) => {
    setSettings(prev => ({ ...prev, readingSpeed: speed }))
  }

  const readPage = () => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel()

      // Get all text content from the page
      const mainContent = document.querySelector('main') || document.body
      const text = mainContent.innerText

      const newUtterance = new SpeechSynthesisUtterance(text)
      newUtterance.rate = settings.readingSpeed
      newUtterance.lang = i18n.language.startsWith('es') ? 'es-ES' : 'en-US'
      
      newUtterance.onend = () => {
        setIsReading(false)
      }

      newUtterance.onerror = () => {
        setIsReading(false)
      }

      setUtterance(newUtterance)
      window.speechSynthesis.speak(newUtterance)
      setIsReading(true)
    }
  }

  const stopReading = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsReading(false)
    }
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    stopReading()
  }

  // Update speech rate when reading speed changes
  useEffect(() => {
    if (utterance && isReading) {
      window.speechSynthesis.cancel()
      const newUtterance = new SpeechSynthesisUtterance(utterance.text)
      newUtterance.rate = settings.readingSpeed
      newUtterance.lang = i18n.language.startsWith('es') ? 'es-ES' : 'en-US'
      newUtterance.onend = () => setIsReading(false)
      newUtterance.onerror = () => setIsReading(false)
      setUtterance(newUtterance)
      window.speechSynthesis.speak(newUtterance)
    }
  }, [settings.readingSpeed])

  return (
    <AccessibilityContext.Provider
      value={{
        ...settings,
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
        isReading,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider')
  }
  return context
}
