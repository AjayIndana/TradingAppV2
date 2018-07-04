import React from 'react'
import { View, Text, FlatList, ScrollView, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import StockRow from '../Components/StockRow'
import Market from '../Components/Market'
import { StackNavigator } from 'react-navigation'
import ToggleSwitch from 'toggle-switch-react-native'
// More info here: https://facebook.github.io/react-native/docs/flatlist.html

// Styles
import styles from './Styles/TableListStyle'

class TableList extends React.Component {
  // static route = {
  //   navigationBar: {
  //     title: 'Watchlist'
  //   }
  // }
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {title: 'AMD'},
        {title: 'JD'},
        {title: 'SNAP'},
        {title: 'SQ'},
        {title: 'IQ'},
        {title: 'NVDA'},
        {title: 'ROKU'},
        {title: 'ATVI'},
        {title: 'TTWO'},
        {title: 'NKE'},
        {title: 'SKX'},
        {title: 'MU'},
        {title: 'NFLX'},
        {title: 'VRTX'},
        {title: 'SRPT'},
        {title: 'TEVA'},
        {title: 'TWTR'},
        {title: 'MOMO'},
        {title: 'YY'},
        {title: 'BZUN'},
        {title: 'DAL'},
        {title: 'INTC'},
        {title: 'MSFT'},
        {title: 'DBX'},
        {title: 'BOX'},
        {title: 'SHOP'},
        {title: 'WDC'},
        {title: 'NTNX'},
        {title: 'PGR'},
        {title: 'RHT'},
        {title: 'PYPL'},
        {title: 'EL'},
        {title: 'LRCX'},
        {title: 'VLO'},
        {title: 'V'},
        {title: 'ETSY'},
        {title: 'SPLK'},
        {title: 'GOOS'},
        {title: 'RTN'},
        {title: 'CRM'},
        {title: 'OKTA'},
        {title: 'FOXA'},
        {title: 'WTW'},
        {title: 'UAA'},
        {title: 'TSLA'},
        {title: 'FB'},
        {title: 'AAPL'},
        {title: 'EA'},
        {title: 'DIS'},
        {title: 'INCY'},
        {title: 'AMAT'},
      ],
    }
  }


  static navigationOptions = {
    //title: 'Watchlist',
    // headerStyle: {
    //   backgroundColor: "#212121"
    // },
    // headerTitleStyle: {
    //   color: "#fff"
    // }
  };
  /* ***********************************************************
  * STEP 1
  * This is an array of objects with the properties you desire
  * Usually this should come from Redux mapStateToProps
  *************************************************************/



  /* ***********************************************************
  * STEP 2
  * `renderRow` function. How each cell/row should be rendered
  * It's our best practice to place a single component here:
  *
  * e.g.
    return <MyCustomCell title={item.title} description={item.description} />
  *************************************************************/
  renderRow ({item}) {
    return (
      <View style={styles.row}>
          <StockRow symbol={item.title}/>
      </View>
    )
  }

  /* ***********************************************************
  * STEP 3
  * Consider the configurations we've set below.  Customize them
  * to your liking!  Each with some friendly advice.
  *************************************************************/
  // Render a header?
  renderHeader = () =>
    <Text style={[styles.label, styles.sectionHeader]}>Watchlist</Text>

  // Render a footer?
  renderFooter = () =>
    <Text style={[styles.label, styles.sectionHeader]}> - Footer - </Text>

  // Show this when data is empty
  renderEmpty = () =>
    <Text style={styles.label}> - Nothing to See Here - </Text>

  renderSeparator = () =>
    <Text style={styles.label}> - ~~~~~ - </Text>

  // The default function if no Key is provided is index
  // an identifiable key is important if you plan on
  // item reordering.  Otherwise index is fine
  keyExtractor = (item, index) => index

  // How many items should be kept im memory as we scroll?
  oneScreensWorth = 20

  // extraData is for anything that is not indicated in data
  // for instance, if you kept "favorites" in `this.state.favs`
  // pass that in, so changes in favorites will cause a re-render
  // and your renderItem will have access to change depending on state
  // e.g. `extraData`={this.state.favs}

  // Optimize your list if the height of each item can be calculated
  // by supplying a constant height, there is no need to measure each
  // item after it renders.  This can save significant time for lists
  // of a size 100+
  // e.g. itemLayout={(data, index) => (
  //   {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
  // )}

  render () {
    return (
      <View style={styles.container}>
        <Market />
        <ScrollView>
          <FlatList
            contentContainerStyle={styles.listContent}
            data={this.state.data}
            renderItem={this.renderRow}
            keyExtractor={this.keyExtractor}
            initialNumToRender={this.oneScreensWorth}
            //ListHeaderComponent={this.renderHeader}
            //ListFooterComponent={this.renderFooter}
            //ListEmptyComponent={this.renderEmpty}
            //ItemSeparatorComponent={this.renderSeparator}
          />
        </ScrollView>
      </View>
    )
  }
}

// const mapStateToProps = (state) => {
//   return {
//     // ...redux state to props here
//   }
// }
//
// const mapDispatchToProps = (dispatch) => {
//   return {
//   }
// }

export default TableList
