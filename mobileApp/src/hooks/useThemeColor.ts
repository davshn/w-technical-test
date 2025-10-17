import { Colors } from '../constants/theme'
import { useColorScheme, ColorSchemeName } from 'react-native'

export function useThemeColor(
  props: { light?: string, dark?: string, theme?: ColorSchemeName },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props.theme;

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
