/**
 * AthletIA - Index de Estilos
 * 
 * Re-exportación centralizada del sistema de diseño para imports más limpios.
 * Permite importar todo desde un solo lugar.
 */

// Exportar todo del theme
export {
    BorderRadius, Colors, Fonts, Shadows, Spacing, Theme, Typography, withOpacity
} from './theme';

// Re-exportar tipos útiles si se necesitan
export type { TextStyle } from 'react-native';

// Exportar configuración de la app
export { Config } from './config';

