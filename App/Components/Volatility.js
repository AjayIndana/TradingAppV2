import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { View, Text } from 'react-native'
import styles from './Styles/HhVolatilityStyle'

export default class Volatility extends Component {
  static propTypes = {
    text: PropTypes.number,
    direction: PropTypes.string,
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
    if(this.props.direction=="up" && this.props.text>0.35 && this.props.text<1.5) {
      return (
        <View style={styles.container}>
          <Text style={styles.textboxGreen}>{this.props.text}</Text>
        </View>
      )
    } else if(this.props.direction=="down" && this.props.text>0.35 && this.props.text<1.5) {
      return (
        <View style={styles.container}>
          <Text style={styles.textboxRed}>{this.props.text}</Text>
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.textbox}>{this.props.text}</Text>
        </View>
      )
    }
  }
}
