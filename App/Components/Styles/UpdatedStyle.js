import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts } from '../../Themes/'

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: 'black'
  },
  textbox: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15
  }
})
