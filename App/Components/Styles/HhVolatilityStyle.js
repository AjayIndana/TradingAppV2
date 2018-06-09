import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts } from '../../Themes/'

export default StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: Metrics.screenWidth/7,
    height: 50,
    backgroundColor: 'black',
  },
  textbox: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  textboxRed: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 15,
  },
  textboxGreen: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 15,
  }
})
