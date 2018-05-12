import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts } from '../../Themes/'

export default StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 130,
    height: 50,
    backgroundColor: 'black',
  },
  textbox: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  rangebox: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10,
  }
})
