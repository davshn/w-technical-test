'use strict'

const React = require('react')
const { Text } = require('react-native')

function MockIcon(props) {
  const { name, size, color, testID, ...restProps } = props

  return React.createElement(
    Text,
    {
      ...restProps,
      testID: testID || `mock-icon-${name}`,
      style: [
        restProps.style,
        {
          fontFamily: 'MockFont',
          fontSize: size || 20,
          color: color || '#000',
        },
      ],
    },
    `[${name}]`
  )
}

MockIcon.displayName = 'MockIcon'

module.exports = MockIcon
module.exports.default = MockIcon
module.exports.FontAwesome = MockIcon

Object.defineProperty(module.exports, '__esModule', {
  value: true,
})