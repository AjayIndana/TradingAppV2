import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { View, Text } from 'react-native'
import styles from './Styles/SevenRangeStyle'

export default class Buy extends Component {
  static propTypes = {
    text: PropTypes.string
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
    if(this.props.text<0.5){
      return (
        <View style={styles.container} backgroundColor='green'>
          <Text style={styles.textbox}>{this.props.text}</Text>
        </View>
      )
    }
    else {
      return (
        <View style={styles.container} backgroundColor='grey'>
          <Text style={styles.textbox}>{this.props.text}</Text>
        </View>
      )
    }
  }
}
