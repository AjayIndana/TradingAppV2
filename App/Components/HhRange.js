import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { View, Text } from 'react-native'
import styles from './Styles/HhRangeStyle'

export default class HhRange extends Component {
  static propTypes = {
    text: PropTypes.number,
    inverse: PropTypes.bool.isRequired,
    up: PropTypes.number,
    down: PropTypes.number,
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
    if((this.props.text<this.props.down && !this.props.inverse) || (this.props.text>this.props.up && this.props.inverse)){
      return (
        <View style={styles.container} backgroundColor='red'>
          <Text style={styles.textbox}>{this.props.text}</Text>
        </View>
      )
    }
    else if((this.props.text>this.props.up && !this.props.inverse) || (this.props.text<this.props.down && this.props.inverse)){
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
