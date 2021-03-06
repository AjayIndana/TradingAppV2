import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native'
import styles from './Styles/MarketStyle'
import Symbol from './Symbol'
import DayRange from './DayRange'
import HhRange from './HhRange'
import Buy from './Buy'
import DayVolatility from './DayVolatility'
import HhVolatility from './HhVolatility'
import MarketHeader from './MarketHeader'
import SevenRange from './SevenRange'
import PushController from './PushController'
import PushNotification from 'react-native-push-notification'
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
      sim_date: '2018-07-03T16:32:00',
      sim_count: 0,
      simulate: false,
      signal: 'N',
      current_time: '',
    }

    setInterval(() => {
      this.getClosePrice("^IXIC");
      this.simulator_count();
    }, 30000);

    this.updateRow = this.updateRow.bind(this);
    this.getClosePrice = this.getClosePrice.bind(this);
    this.handlePushNotification = this.handlePushNotification.bind(this);
    this.simulator_count = this.simulator_count.bind(this);
  }

  componentDidMount = () => {
    this.getClosePrice("^IXIC");
    this.simulator_count();
  }

  static propTypes = {
    symbol: PropTypes.string
  }

  handlePushNotification(signal){
    PushNotification.localNotification({
      message: "Market shifted gears : " + signal// (required)
    });
  }

  simulator_count(){
    var sim_count = this.state.sim_count + 1;
    this.setState({'sim_count': sim_count});
    var today = new Date();
    if(this.state.simulate){
      today = new Date(this.state.sim_date);
      today.setMinutes(today.getMinutes()+sim_count);
    }
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();
    if(hours<10){
        hours='0'+hours;
    }
    if(minutes<10){
        minutes='0'+minutes;
    }
    if(seconds<10){
        seconds='0'+seconds;
    }
    var time = hours + ":" + minutes + ":" + seconds;
    this.setState({'current_time': time});
  }

  getClosePrice(symbol){
    var symbol = ".IXIC"
    var simulateUrl = function(symbol,simulator_date,sim_count) {
      var today = new Date(simulator_date);
      today.setMinutes(today.getMinutes()+sim_count);
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
      var hours = today.getHours();
      var minutes = today.getMinutes();
      if(dd<10){
          dd='0'+dd;
      }
      if(mm<10){
          mm='0'+mm;
      }
      if(hours<10){
          hours='0'+hours;
      }
      if(minutes<10){
          minutes='0'+minutes;
      }
      var url = 'https://ts-api.cnbc.com/harmony/app/bars/'+symbol+'/1M/'+yyyy+mm+dd+'093000'+'/'+yyyy+mm+dd+hours+minutes+'00'+'/adjusted/EST5EDT.json';
      return url;
    }

    if(this.state.simulate){
      url = simulateUrl(symbol, this.state.sim_date, this.state.sim_count);

      return fetch(url)
       .then((response) => response.json())
       .then((responseJson) => {
         responseJson = responseJson["barData"]["priceBars"];
         var close = responseJson.map(function(n){ return n["close"] });
         close=close.filter(function(n){ return n != undefined });
         this.setState({'closePrice': close.pop()});
       })
       .then(() => {
         this.updateRow(symbol)
       })
       .catch((error,symbol,response) => {
         console.log(error);
       });

    } else {
      return fetch('https://quote.cnbc.com/quote-html-webservice/quote.htm?symbols='+symbol+'&partnerId=2&requestMethod=quick&exthrs=1&noform=1&fund=1&output=jsonp&events=1&callback=quoteHandler1')
      .then((response) => {
            var result = JSON.parse(response["_bodyText"].split("quoteHandler1(")[1].slice(0, -1));
            this.setState({'closePrice': result["QuickQuoteResult"]["QuickQuote"]["last"]});
        })
        .then(() => {
          //this.getPreviousPrice(symbol)
        })
        .then(() => {
          this.updateRow(symbol)
        })
        .catch((error,symbol,response) => {
          console.log(error);
        });

    }
  }


  async updateRow(symbol) {
    var symbol = ".IXIC"

    var simulateUrl = function(symbol,simulator_date,sim_count) {
      var today = new Date(simulator_date);
      today.setMinutes(today.getMinutes()+sim_count);
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
      var hours = today.getHours();
      var minutes = today.getMinutes();
      if(dd<10){
          dd='0'+dd;
      }
      if(mm<10){
          mm='0'+mm;
      }
      if(hours<10){
          hours='0'+hours;
      }
      if(minutes<10){
          minutes='0'+minutes;
      }
      var time = hours + ":" + minutes + ":00";
      //this.setState({'current_time': time});
      var url = 'https://ts-api.cnbc.com/harmony/app/bars/'+symbol+'/1M/'+yyyy+mm+dd+'093000'+'/'+yyyy+mm+dd+hours+minutes+'00'+'/adjusted/EST5EDT.json';
      return url;
    }

    var realUrl = function(symbol){
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
      var hours = today.getHours();
      var minutes = today.getMinutes();
      if(hours<10){
          hours='0'+hours;
      }
      if(minutes<10){
          minutes='0'+minutes;
      }
      var time = hours + ":" + minutes + ":00";
      //this.setState({'current_time': time});
      var url = 'https://ts-api.cnbc.com/harmony/app/bars/'+symbol+'/1M/'+yyyy+mm+dd+'093000'+'/'+yyyy+mm+dd+'160000'+'/adjusted/EST5EDT.json';
      return url;
    }

    var url= realUrl(symbol);
    if(this.state.simulate){
      url = simulateUrl(symbol, this.state.sim_date, this.state.sim_count);
    }

     //   return fetch('https://query1.finance.yahoo.com/v8/finance/chart/'+symbol+'?range=1d&includePrePost=false&interval=1m')
   return fetch(url)
     .then((response) => response.json())
     .then((responseJson) => {
       responseJson = responseJson["barData"]["priceBars"];
       var closePrice = this.state.closePrice;

      var open = responseJson.map(function(n){ return n["open"] });
      open=open.filter(function(n){ return n != undefined });
      var openPrice = parseFloat(open[0]).toFixed(2);

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

       var close = responseJson.map(function(n){ return n["close"] });
       close=close.filter(function(n){ return n != undefined });
       var close30 = close.slice(close.length-30, close.length);

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
       var open30 = open.slice(open.length-30, open.length);
       var openPrice30 = parseFloat(open30[0]).toFixed(2);

       var hhRange=0;
       var hhVolatility=0;
       if(low.length>30){
         var hhVolatility = Math.round(((highPrice30-lowPrice30)/closePrice)*100*100)/100;
         this.setState({'hhVolatility': hhVolatility});
         hhRange = Math.round(((closePrice-lowPrice30)/(highPrice30-lowPrice30))*100);
         this.setState({'hhRange': hhRange});
       } else {
         hhRange=dayRange;
         hhVolatility=dayVolatility;
         this.setState({'hhRange': dayRange});
         this.setState({'hhVolatility': dayVolatility});
       }

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
       var last_high = high[high.length-1];
       var sevenRange_high = Math.round(((last_high-lowPrice7)/(highPrice7-lowPrice7))*100);
       this.setState({'sevenRange_high': sevenRange_high});
       var last_low = low[low.length-1];
       var sevenRange_low = Math.round(((last_low-lowPrice7)/(highPrice7-lowPrice7))*100);
       this.setState({'sevenRange_low': sevenRange_low});

       if(hhRange<35 && hhVolatility>0.20){
         var signal = "S";
         if(this.state.signal!="S"){
           this.handlePushNotification("Short");
           this.setState({'signal': signal});
          }
       } else if(hhRange>65 && hhVolatility>0.20){
         var signal = "B";
         if(this.state.signal!="B"){
           this.handlePushNotification("Buy");
           this.setState({'signal': signal});
          }
       } else {
         var signal = "N";
         if(this.state.signal!="N"){
           this.handlePushNotification("Neutral");
           this.setState({'signal': signal});
          }
         this.setState({'signal': signal});
       }

     })
     .catch((error,symbol,response) => {
      //  console.log(error);
     });
  }

  render () {
    return (
        <View style={styles.container}>
          <MarketHeader text1="MARKET" text2={this.state.current_time}/>
          <HhRange text={this.state.dayRange} inverse={false} up={65} down={35}/>
          <HhVolatility text={this.state.hhVolatility}/>
          <HhRange text={this.state.hhRange} inverse={false} up={65} down={35}/>
          <Buy text={this.state.signal}/>
          <HhRange text={this.state.sevenRange_high} inverse={false} up={50} down={50}/>
          <HhRange text={this.state.sevenRange_low} inverse={false} up={50} down={50}/>
        </View>
    )
  }
}
