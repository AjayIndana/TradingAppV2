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
        {title: 'AAOI'},
        {title: 'AAPL'},
        {title: 'ABBV'},
        {title: 'ADBE'},
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
        {title: 'DAL'},
        {title: 'EA'},
        {title: 'EXAS'},
        {title: 'EXEL'},
        {title: 'FB'},
        {title: 'GILD'},
        {title: 'GLW'},
        {title: 'HBAN'},
        {title: 'HON'},
        {title: 'INTC'},
        {title: 'MA'},
        {title: 'MOMO'},
        {title: 'MRK'},
        {title: 'MSFT'},
        {title: 'MU'},
        {title: 'NFLX'},
        {title: 'NOW'},
        {title: 'NKE'},
        {title: 'NTES'},
        {title: 'NTNX'},
        {title: 'NVDA'},
        {title: 'OLED'},
        {title: 'ORCL'},
        {title: 'PFE'},
        {title: 'PYPL'},
        {title: 'QCOM'},
        {title: 'RHT'},
        {title: 'ROKU'},
        {title: 'SHOP'},
        {title: 'SQ'},
        {title: 'SO'},
        {title: 'SIRI'},
        {title: 'TGT'},
        {title: 'TMO'},
        {title: 'TSLA'},
        {title: 'TXN'},
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
    this.handler = this.handler.bind(this);
    this._keyExtractor = this._keyExtractor.bind(this);
  }

  componentWillMount = () => {
  //  this._keyExtractor();
  }

  _keyExtractor() {
    var data = [
      {title: 'AAOI'},
      {title: 'AAPL'},
      {title: 'ADBE'},
      {title: 'AKAM'},
      {title: 'ALXN'},
      {title: 'AMAT'},
      {title: 'AMD'},
      {title: 'AMGN'},
      {title: 'AMTD'},
      {title: 'AMZN'},
      {title: 'ATVI'},
      {title: 'AVGO'},
      {title: 'BA'},
      {title: 'BABA'},
      {title: 'BEAT'},
      {title: 'BIDU'},
      {title: 'BLK'},
      {title: 'BZUN'},
      {title: 'CAT'},
      {title: 'CELG'},
      {title: 'CMCSA'},
      {title: 'CSCO'},
      {title: 'DAL'},
      {title: 'EXAS'},
      {title: 'FB'},
      {title: 'GILD'},
      {title: 'HBAN'},
      {title: 'INTC'},
      {title: 'ISRG'},
      {title: 'LRCX'},
      {title: 'MOMO'},
      {title: 'MRK'},
      {title: 'MSFT'},
      {title: 'MU'},
      {title: 'MZOR'},
      {title: 'NFLX'},
      {title: 'NKE'},
      {title: 'NTES'},
      {title: 'NTNX'},
      {title: 'NVDA'},
      {title: 'OLED'},
      {title: 'ORCL'},
      {title: 'PETS'},
      {title: 'QCOM'},
      {title: 'RHT'},
      {title: 'ROKU'},
      {title: 'SHOP'},
      {title: 'SQ'},
      {title: 'SIRI'},
      {title: 'TSLA'},
      {title: 'UNH'},
      {title: 'VRTX'},
      {title: 'WDC'},
      {title: 'WMT'},
      {title: 'YY'}
    ];
       // returns all keys in object
       const result = data.map(o => ({ ...o, text: 0 }));
//       console.log(result);
       this.setState('data': result);
    }

  handler(param1) {
    //console.log(param1);
    this.setState({
      'MarketVolatility': param1
    });
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
