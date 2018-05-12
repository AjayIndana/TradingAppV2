import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native'
import styles from './Styles/MarketStyle'
import Symbol from './Symbol'
import DayRange from './DayRange'
import HhRange from './HhRange'
import DayVolatility from './DayVolatility'
import HhVolatility from './HhVolatility'
import SevenRange from './SevenRange'
import { ArtyCharty } from 'arty-charty'

export default class Market extends Component {

  constructor(props) {
    super(props);
    this.state = {
      closePrice: '',
      dayRange: '',
      hhVolatility: '',
      dayVolatility: '',
      hhRange: '',
      hourVolatility: '',
      sevenRange: '',
      hourRange: '',
    }

    setInterval(() => {
      this.getClosePrice("^IXIC");
    }, 30000);

    this.updateRow = this.updateRow.bind(this);
    this.getClosePrice = this.getClosePrice.bind(this);
  }

  componentDidMount = () => {
    this.getClosePrice("^IXIC");
  }

  static propTypes = {
    symbol: PropTypes.string
  }

  handlePushNotification(symbol, status, time){
    PushNotification.localNotification({
      message: symbol + " was a " + status + " at " + time // (required)
    });
  }

  async getClosePrice(symbol){
    if(symbol.includes("IXIC")){
      symbol = ".IXIC";
      return fetch('https://quote.cnbc.com/quote-html-webservice/quote.htm?symbols='+symbol+'&partnerId=2&requestMethod=quick&exthrs=1&noform=1&fund=1&output=jsonp&events=1&callback=quoteHandler1')
      .then((response) => {
            var result = JSON.parse(response["_bodyText"].split("quoteHandler1(")[1].slice(0, -1));
          //  console.log(result["QuickQuoteResult"]["QuickQuote"]["last"]);
            this.setState({'closePrice': result["QuickQuoteResult"]["QuickQuote"]["last"]});

           // var fields =  JSON.stringify(response);
           //  this.setState({'closePrice': JSON.parse(fields)["_bodyText"].split("|")[1]});
           //  //return JSON.parse(fields)["_bodyText"].split("|")[1];
        })
        .then(() => {
          // if(symbol.includes("IXIC")){
          //   symbol = "^IXIC";
          // }
          this.updateRow(symbol)
        })
        .catch((error,symbol,response) => {
          console.log(error);
        });
    }
  }

  async updateRow(symbol) {

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd;
    }
    if(mm<10){
        mm='0'+mm;
    }

    var url = 'https://ts-api.cnbc.com/harmony/app/bars/'+symbol+'/1M/'+yyyy+mm+dd+'093000'+'/'+yyyy+mm+dd+'160000'+'/adjusted/EST5EDT.json'

    // Simulator code

        // dd =  today.getDate() -1;
        // if(dd<10){
        //     dd='0'+dd;
        // }
        // var hours = today.getHours() - 10;
        // if(hours<10){
        //     hours='0'+hours;
        // }
        // var min = today.getMinutes();
        // if(min<10){
        //     min='0'+min;
        // }
        // var sec = today.getSeconds();
        // if(sec<10){
        //     sec='0'+sec;
        // }
        // url = 'https://ts-api.cnbc.com/harmony/app/bars/'+symbol+'/1M/'+yyyy+mm+dd+'093000'+'/'+yyyy+mm+dd+hours+min+sec+'/adjusted/EST5EDT.json'

    // Simulator code

     //   return fetch('https://query1.finance.yahoo.com/v8/finance/chart/'+symbol+'?range=1d&includePrePost=false&interval=1m')
   return fetch(url)
     .then((response) => response.json())
     .then((responseJson) => {
       responseJson = responseJson["barData"]["priceBars"];
       var closePrice = this.state.closePrice;

       // Simulator code

       // var close = responseJson.map(function(n){
       //  return n["close"];
       //   });
       //  closePrice = close[close.length-1];
       //  this.setState({'closePrice': closePrice});

      // Simulator code

       var high = responseJson.map(function(n){
        // if(n.high!=0 && n.high!=-1) return n.high;
        return n["high"];
         });
       high=high.filter(function(n){ return n != undefined });
       var highPrice = high.reduce((max, n) => n > max ? n : max);
       if(closePrice > highPrice){
         highPrice = closePrice;
       }

       var low = responseJson.map(function(n){
        // if(n.low!=0 && n.low!=-1) return n.low;
        return n["low"];
         });
       low=low.filter(function(n){ return n != undefined });
       var lowPrice = low.reduce((min, n) => n < min ? n : min)
       if(closePrice < lowPrice){
         lowPrice = closePrice;
       }

       var dayRange = Math.round(((closePrice-lowPrice)/(highPrice-lowPrice))*100);
       var dayVolatility = Math.round(((highPrice-lowPrice)/closePrice)*100*100)/100;
       this.setState({'dayRange': dayRange});
       this.setState({'dayVolatility': dayVolatility});

       var high30 = high.slice(high.length-30, high.length);
       var highPrice30 = high30.reduce((max, n) => n > max ? n : max);
       if(closePrice > highPrice30){
         highPrice30 = closePrice;
       }
       var low30 = low.slice(low.length-30, low.length);
       var lowPrice30 = low30.reduce((min, n) => n < min ? n : min)
       if(closePrice < lowPrice30){
         lowPrice30 = closePrice;
       }
       var hhRange = Math.round(((closePrice-lowPrice30)/(highPrice30-lowPrice30))*100);
       this.setState({'hhRange': hhRange});
       var hhVolatility = Math.round(((highPrice30-lowPrice30)/closePrice)*100*100)/100;
       this.setState({'hhVolatility': hhVolatility});

       var high60 = high.slice(high.length-60, high.length);
       var highPrice60 = high60.reduce((max, n) => n > max ? n : max);
       if(closePrice > highPrice60){
         highPrice60 = closePrice;
       }
       var low60 = low.slice(low.length-60, low.length);
       var lowPrice60 = low60.reduce((min, n) => n < min ? n : min)
       if(closePrice < lowPrice60){
         lowPrice60 = closePrice;
       }
       var hourRange = Math.round(((closePrice-lowPrice60)/(highPrice60-lowPrice60))*100);
       this.setState({'hourRange': hourRange});
       var hourVolatility = Math.round(((highPrice60-lowPrice60)/closePrice)*100*100)/100;
       this.setState({'hourVolatility': hourVolatility});


       var high7 = high.slice(high.length-6, high.length);
       var highPrice7 = high7.reduce((max, n) => n > max ? n : max);
       if(closePrice > highPrice7){
         highPrice7 = closePrice;
       }
       var low7 = low.slice(low.length-6, low.length);
       var lowPrice7 = low7.reduce((min, n) => n < min ? n : min)
       if(closePrice < lowPrice7){
         lowPrice7 = closePrice;
       }
       var sevenRange = Math.round(((closePrice-lowPrice7)/(highPrice7-lowPrice7))*100);
       this.setState({'sevenRange': sevenRange});

     })
     .catch((error,symbol,response) => {
      //  console.log(error);
     });
  }

  render () {
    return (
        <View style={styles.container}>
          <HhVolatility text="MARKET"/>
          <HhRange text={this.state.dayRange}/>
          <HhVolatility text={this.state.dayVolatility}/>
          <HhRange text={this.state.hourRange}/>
          <HhVolatility text={this.state.hourVolatility}/>
          <HhRange text={this.state.sevenRange}/>
        </View>
    )
  }
}
