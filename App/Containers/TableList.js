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
        {title: 'AAL'},
        {title: 'AAOI'},
        {title: 'AAPL'},
        {title: 'ABBV'},
        {title: 'ADBE'},
        {title: 'ADI'},
        {title: 'ADP'},
        {title: 'AKAM'},
        {title: 'ALXN'},
        {title: 'AMAT'},
        {title: 'AMD'},
        {title: 'AMGN'},
        {title: 'AMTD'},
        {title: 'ATVI'},
        {title: 'AVGO'},
        {title: 'BABA'},
        {title: 'BIDU'},
        {title: 'BSX'},
        {title: 'BZUN'},
        {title: 'CAT'},
        {title: 'CCI'},
        {title: 'CELG'},
        {title: 'CMCSA'},
        {title: 'CRM'},
        {title: 'CSCO'},
        {title: 'DBX'},
        {title: 'DAL'},
        {title: 'EA'},
        {title: 'ESRX'},
        {title: 'EXAS'},
        {title: 'EXEL'},
        {title: 'FB'},
        {title: 'FOXA'},
        {title: 'GILD'},
        {title: 'GRUB'},
        {title: 'HBAN'},
        {title: 'HON'},
        {title: 'INTC'},
        {title: 'IQ'},
        {title: 'JD'},
        {title: 'MA'},
        {title: 'MOMO'},
        {title: 'MRK'},
        {title: 'MSFT'},
        {title: 'MU'},
        {title: 'MYL'},
        {title: 'NFLX'},
        {title: 'NOW'},
        {title: 'NKE'},
        {title: 'NKTR'},
        {title: 'NTAP'},
        {title: 'NTES'},
        {title: 'NTNX'},
        {title: 'NVDA'},
        {title: 'OLED'},
        {title: 'ORCL'},
        {title: 'PFE'},
        {title: 'PLNT'},
        {title: 'PYPL'},
        {title: 'QCOM'},
        {title: 'RHT'},
        {title: 'ROKU'},
        {title: 'SHOP'},
        {title: 'SNAP'},
        {title: 'SQ'},
        {title: 'SO'},
        {title: 'SIRI'},
        {title: 'TGT'},
        {title: 'TMO'},
        {title: 'TSLA'},
        {title: 'TXN'},
        {title: 'TWTR'},
        {title: 'UAL'},
        {title: 'ULTA'},
        {title: 'UNH'},
        {title: 'V'},
        {title: 'VRTX'},
        {title: 'WDC'},
        {title: 'WMT'},
        {title: 'YY'}
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
        <Market handler />
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
