import { Platform } from 'react-native'

export const Colors:any = {
  light: {
    background: '#ecd0ec',
    primary: '#7e2a53',
    secondary: '#441b2a',
    textPrimary: '#1a0f15',
    textSecondary: 'rgba(26, 15, 21, 0.7)',
    tint: '#ba71a2',
    success: '#2E7D32',
    warning: '#ED6C02',
    error: '#D32F2F',
    disabled: 'rgba(26, 15, 21, 0.3)',
    white: '#FFFFFF',
    transparent: 'transparent',
  },
  dark: {
    background: '#1a0f15',
    primary: '#7e2a53',
    secondary: '#ba71a2',
    textPrimary: '#ecd0ec',
    textSecondary: 'rgba(236, 208, 236, 0.7)',
    tint: '#441b2a',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#E53935',
    disabled: 'rgba(236, 208, 236, 0.3)',
    white: '#FFFFFF',
    transparent: 'transparent',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
