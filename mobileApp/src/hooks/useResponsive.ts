import { Dimensions } from 'react-native'
import { useEffect, useState } from 'react'
export const useResponsive = () => {
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width)
    });

    return () => subscription?.remove()
  }, [])

  return {
    screenWidth,
    isSmallPhone: screenWidth < 350,
    isRegularPhone: screenWidth >= 350 && screenWidth < 410,
    isLargePhone: screenWidth >= 410,
  }
}
