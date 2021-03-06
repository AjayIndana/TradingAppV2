import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { View, Text } from 'react-native'
import styles from './Styles/VolumeStyle'

export default class Volume extends Component {
  static propTypes = {
    VolPer: PropTypes.number,
    VolChange: PropTypes.string,
    DayRange: PropTypes.number,
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
    if(this.props.VolChange=="up" && this.props.DayRange>65){
      return (
        <View style={styles.container} backgroundColor='green'>
          <Text style={styles.textbox}>{this.props.VolPer}</Text>
        </View>
      )
    }
    else if(this.props.VolChange=="up" && this.props.DayRange<35){
      return (
        <View style={styles.container} backgroundColor='red'>
          <Text style={styles.textbox}>{this.props.VolPer}</Text>
        </View>
      )
    }
    else {
      return (
        <View style={styles.container} backgroundColor='grey'>
          <Text style={styles.textbox}>{this.props.VolPer}</Text>
        </View>
      )
    }
  }
}
