import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { View, Text } from 'react-native'
import styles from './Styles/SymbolStyle'

export default class Symbol extends Component {
  static propTypes = {
    text: PropTypes.string,
    signal: PropTypes.string,
    closePrice: PropTypes.string
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
    if(this.props.signal == "Buy"){
      return (
        <View style={styles.container}>
          <Text style={styles.textboxGreen}>{this.props.text}</Text>
          <Text style={styles.textboxGreen}>{this.props.closePrice}</Text>
        </View>
      )
    } else if(this.props.signal == "Short"){
      return (
        <View style={styles.container}>
          <Text style={styles.textboxRed}>{this.props.text}</Text>
          <Text style={styles.textboxRed}>{this.props.closePrice}</Text>
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.textbox}>{this.props.text}</Text>
          <Text style={styles.textbox}>{this.props.closePrice}</Text>
        </View>
      )
    }
  }
}
