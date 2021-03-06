import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { View, Text } from 'react-native'
import styles from './Styles/SevenRangeStyle'

export default class SevenRangeVol extends Component {
  static propTypes = {
    up: PropTypes.number,
    down: PropTypes.number
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
    if(this.props.up>=this.props.down && this.props.up>0.20){
      return (
        <View style={styles.container} backgroundColor='green'>
          <Text style={styles.textbox}>{this.props.up}</Text>
        </View>
      )
    }
    else if(this.props.up<this.props.down && this.props.down>0.20) {
      return (
        <View style={styles.container} backgroundColor='red'>
          <Text style={styles.textbox}>{this.props.down}</Text>
        </View>
      )
    }
    else {
      return (
        <View style={styles.container} backgroundColor='grey'>
          <Text style={styles.textbox}>{this.props.down}</Text>
        </View>
      )
    }
  }
}
