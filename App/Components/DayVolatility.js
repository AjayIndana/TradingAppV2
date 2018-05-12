import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { View, Text } from 'react-native'
import styles from './Styles/DayVolatilityStyle'

export default class DayVolatility extends Component {
  static propTypes = {
    text: PropTypes.string,
    range: PropTypes.string,
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
        <Text style={styles.textbox}>{this.props.range}</Text>
        <Text style={styles.textbox}>{this.props.text}</Text>
      </View>
    )
  }
}
