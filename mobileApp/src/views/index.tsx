import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './Home';

export const MyTabs = createBottomTabNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Home: HomeScreen,
  },
});
