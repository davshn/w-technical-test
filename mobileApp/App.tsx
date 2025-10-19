import { useColorScheme } from 'react-native'
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context'
import { createStaticNavigation,   DarkTheme, DefaultTheme, ThemeProvider,} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Provider } from 'react-redux'
import { MyTabs } from './src/views'
import PaymentProcessing from './src/views/PaymentProccesing'
import { store } from './src/stateManagement/store'

const RootStack = createNativeStackNavigator({
  initialRouteName: 'MyTabs',
  screenOptions: {
    headerShown: false,
  },
  screens: {
    MyTabs: MyTabs,
    PaymentProcessing: PaymentProcessing,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  const colorScheme = useColorScheme()

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Navigation />
        </ThemeProvider>
      </Provider>
    </SafeAreaProvider>
  );
}