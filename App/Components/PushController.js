import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { View, Text } from 'react-native'
import styles from './Styles/PushControllerStyle'
import PushNotification from 'react-native-push-notification'

export default class PushController extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }

    this.pushNotification = this.pushNotification.bind(this);
  }

  componentDidMount = () => {
    this.pushNotification();
    //this.updateRow(this.state.symbol);
    //this.sendEmail();
  }

  static propTypes = {
  }
  // // Prop type warnings
  // static propTypes = {
  //
  // }
  //
  // // Defaults for props
  // static defaultProps = {
  //   someSetting: false
  // }

  pushNotification(){
    PushNotification.configure({
      onNotification: function(notification) {
      console.log( 'NOTIFICATION:', notification );
      }
    });
  }

  render () {
    return null;
  }
}
