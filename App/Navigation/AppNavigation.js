import { StackNavigator } from 'react-navigation'
import TableList from '../Containers/TableList'
import LaunchScreen from '../Containers/LaunchScreen'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  TableList: { screen: TableList },
  LaunchScreen: { screen: LaunchScreen }
}, {
  // Default config for all screens
  initialRouteName: 'TableList',
  headerMode: 'none',
  navigationOptions: {
    headerStyle: ''
  }
})

export default PrimaryNav
