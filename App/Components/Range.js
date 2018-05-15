import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { View, Text } from 'react-native'
import styles from './Styles/UpdatedStyle'

export default class Updated extends Component {
  static propTypes = {
    lowPrice: PropTypes.string,
    predPrice: PropTypes.string
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
        <Text style={styles.textbox}>{this.props.lowPrice}</Text>
        <Text style={styles.textbox}>{this.props.predPrice}</Text>
      </View>
    )
  }
}
