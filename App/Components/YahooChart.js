import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, WebView } from 'react-native'
import styles from './Styles/YahooChartStyle'

export default class YahooChart extends Component {
  // // Prop type warnings
  // static propTypes = {
  //   someProperty: PropTypes.object,
  //   someSetting: PropTypes.bool.isRequired,
  // }
  //
  // // Defaults for props
  // static defaultProps = {
  //   someSetting: false
  // }

  render () {
    return (
      <View style={styles.container}>
        <WebView
           source = {{ uri:
              'https://finance.yahoo.com/chart/AMD' }}
        />
      </View>
    )
  }
}
