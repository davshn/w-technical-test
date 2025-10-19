import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './Home';
import CartScreen from './Cart';

export const MyTabs = createBottomTabNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Inicio: HomeScreen,
    Carrito: CartScreen,
  },
});
