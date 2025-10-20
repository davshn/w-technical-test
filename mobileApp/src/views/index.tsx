import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { FontAwesome } from "@react-native-vector-icons/fontawesome"
import HomeScreen from './Home'
import CartScreen from './Cart'
import { useSelector } from 'react-redux'

const Tab = createBottomTabNavigator();
const screenOptions = ({ route }: any) => ({
  tabBarIcon: ({ color, size }: { color: string; size: number }) => {
    let iconName: 'home' | 'shopping-cart' = 'home';

    if (route.name === 'Home') {
      iconName = 'home';
    } else if (route.name === 'Cart') {
      iconName = 'shopping-cart';
    }

    return <FontAwesome name={iconName} size={size} color={color} />;
  },
  tabBarActiveTintColor: '#7e2a53',
  tabBarInactiveTintColor: 'gray',
  headerShown: false,
  tabBarStyle: { backgroundColor: '#ecd0ec', elevation: 0 },
  tabBarBadgeStyle: {
      color: 'black',
      backgroundColor: '#4CAF50',
    },
})

export const MyTabs = () => {
  const cartNotification = useSelector((state: any) => state.cart.cartNotification);
  return (
    <Tab.Navigator
      screenOptions={screenOptions}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cart" component={CartScreen} options={{
        tabBarBadge: cartNotification ? '' : undefined
      }} />
    </Tab.Navigator>
  );
}
