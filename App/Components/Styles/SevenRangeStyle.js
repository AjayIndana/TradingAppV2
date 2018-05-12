import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts } from '../../Themes/'

export default StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 35,
    height: 50,
    backgroundColor: 'grey'
  },
  textbox: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  }
})
