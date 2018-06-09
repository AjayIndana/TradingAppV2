import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { View, Text } from 'react-native'
import styles from './Styles/MarketHeaderStyle'

export default class MarketHeader extends Component {
  static propTypes = {
    text1: PropTypes.string,
    text2: PropTypes.string
  }
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
        <Text style={styles.textbox}>{this.props.text1}</Text>
        <Text style={styles.textbox}>{this.props.text2}</Text>
      </View>
    )
  }
}
