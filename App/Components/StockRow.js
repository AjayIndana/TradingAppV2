import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native'
import styles from './Styles/StockRowStyle'
import Symbol from './Symbol'
import DayRange from './DayRange'
import HhRange from './HhRange'
import Updated from './Updated'
import DayVolatility from './DayVolatility'
import Volume from './Volume'
import HhVolatility from './HhVolatility'
import Simulate from './Simulate'
import Volatility from './Volatility'
import SevenRange from './SevenRange'
import SevenRangeVol from './SevenRangeVol'
import FifteenRange from './FifteenRange'
import Buy from './Buy'
import HighPer from './HighPer'
import Range from './Range'
import SellPressUp from './SellPressUp'
import SellPressDown from './SellPressDown'
import PushController from './PushController'
import PushNotification from 'react-native-push-notification'
import { ArtyCharty } from 'arty-charty'
import { StackNavigator } from 'react-navigation'

class StockRow extends Component {

  constructor(props) {
    super(props);
    this.state = {
      symbol: props.symbol,
      alert: false,
      buy: 'NA',
      closePrice: '',
      dayRange: '',
      hhVolatility: '',
      dayVolatilityPrice: '',
      dayVolatility: '',
      hhRange: '',
      time: '',
      volumePercent: '',
      expand: false,
      buy: false,
      sell: false,
      short: false,
      cover: false,
      highState: true,
      lowState: true,
      notify: true,
      buynotify: false,
      prevHighPrice: '',
      prevLowPrice: '',
      direction: 'na',
      vol15_avg: 'down',
      sim_date: '2018-07-03T16:32:00',
      sim_count: 0,
      simulate: false,
      simulator_data: '',
    }

    setInterval(() => {
      this.getClosePrice(this.state.symbol);
      this.simulator_count();
    }, 30000);

    this.updateRow = this.updateRow.bind(this);
    this.getClosePrice = this.getClosePrice.bind(this);
    this.handlePushNotification = this.handlePushNotification.bind(this);
    this._onPressButton = this._onPressButton.bind(this);
    this.simulator_count = this.simulator_count.bind(this);
  }

  componentDidMount = () => {
    this.getClosePrice(this.state.symbol);
    this.setState({'notify': true});
  }

  static propTypes = {
    symbol: PropTypes.string
  }

  handlePushNotification(text){
    var todayDate = new Date().toISOString();
      PushNotification.localNotification({
        message: text + " " + this.state.symbol + " " + this.state.shares
      });
  }

  _onPressButton(){
    if(this.state.expand){
      this.setState({'expand': false});
    }
    else {
      this.setState({'expand': true});
    }

  }

  simulator_count(){
    this.setState({'sim_count': this.state.sim_count+1});
  }

  async getClosePrice(symbol){
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
         this.setState({'closePrice': parseFloat(close.pop()).toFixed(2)});
       })
       .then(() => {
         this.updateRow(symbol);
       })
       .catch((error,symbol,response) => {
         console.log(error);
       });

    } else {
      return fetch('https://quote.cnbc.com/quote-html-webservice/quote.htm?symbols='+symbol+'&partnerId=2&requestMethod=quick&exthrs=1&noform=1&fund=1&output=jsonp&events=1&callback=quoteHandler1')
      .then((response) => {
            var result = JSON.parse(response["_bodyText"].split("quoteHandler1(")[1].slice(0, -1));
            this.setState({'closePrice': parseFloat(result["QuickQuoteResult"]["QuickQuote"]["last"]).toFixed(2)});
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

      var url = 'https://ts-api.cnbc.com/harmony/app/bars/'+symbol+'/1M/'+yyyy+mm+dd+'093000'+'/'+yyyy+mm+dd+'160000'+'/adjusted/EST5EDT.json';
      return url;
    }

    var url = realUrl(symbol);
    if(this.state.simulate){
      url = simulateUrl(symbol, this.state.sim_date, this.state.sim_count);
    }

    return fetch(url)
     .then((response) => response.json())
     .then((responseJson) => {
       responseJson = responseJson["barData"]["priceBars"];
       var closePrice = this.state.closePrice;

       var getPreviousVolume = function(symbol, length, simulate, simulator_date){
         var count = 1;
         var prevVolume = 0;
         var fetchNow = function() {
           var yesterday = new Date();
           if(simulate){
             yesterday = new Date(simulator_date);
           }
           yesterday.setDate(yesterday.getDate() - count);
           var dd = yesterday.getDate();
           var mm = yesterday.getMonth()+1; //January is 0!
           var yyyy = yesterday.getFullYear();
           if(dd<10){
               dd='0'+dd;
           }
           if(mm<10){
               mm='0'+mm;
           }

           var url = 'https://ts-api.cnbc.com/harmony/app/bars/'+symbol+'/1M/'+yyyy+mm+dd+'093000'+'/'+yyyy+mm+dd+'160000'+'/adjusted/EST5EDT.json'

           fetch(url)
           .then((response) => response.json())
           .then((responseJson) => {
                 responseJson = responseJson["barData"]["priceBars"];

                 var volume = responseJson.map(function(n){ return n["volume"] });
                 volume=volume.filter(function(n){ return n != undefined });
                 var close = responseJson.map(function(n){ return n["close"] });
                 close=close.filter(function(n){ return n != undefined });

                 if(volume.length>0){
                   var open = this.state.prevOpenPrice;
                   if(length>close.length){
                     length = close.length;
                   }
                   var prevVolatility = close[length-1] - open;
                   //this.setState({'prevVolatility': prevVolatility});
                   var vol = volume.slice(0,length);
                   prevVolume = vol.reduce((a, b) => a + b, 0);
                   this.setState({'prevVolume': prevVolume});
                 }
                 else {
                   count = count+1;
                   fetchNow();
                 }
             })
             .catch((error,symbol,response) => {
               console.log(error);
             });
           }.bind(this)

          fetchNow();
         }.bind(this)

        var shares = Math.round(12500/closePrice);
        this.setState({'shares': shares});
        //console.log("running  " + symbol + " " + cos + " " + roc);


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

         var volume = responseJson.map(function(n){ return n["volume"] });
         volume=volume.filter(function(n){ return n != undefined });

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
          if((dayRange>90 || (dayRange>65 && hhRange>85)) && sevenRange_low>50 && sevenRange_high>70){
            this.setState({'show': "yes"});
          } else if((dayRange<10 || (dayRange<35 && hhRange<15)) && sevenRange_low<30 && sevenRange_high<50){
            this.setState({'show': "yes"});
          } else {
            this.setState({'show': "no"});
          }

        this.setState({'max_high': parseFloat(highPrice7).toFixed(2)});
        this.setState({'min_low': parseFloat(lowPrice7).toFixed(2)});

        getPreviousVolume(symbol, open.length, this.state.simulate, this.state.sim_date);
        var todaysVolume = volume.reduce((a, b) => a + b, 0);
        var volChange = todaysVolume - this.state.prevVolume;
        var volPer = parseFloat((volChange/this.state.prevVolume)*100).toFixed(0);

        if(volChange>0){
          this.setState({'volPer': volPer});
          this.setState({'volChange': 'up'});
        } else {
          this.setState({'volPer': (-1*volPer)});
          this.setState({'volChange': 'down'});
        }

     })
     .catch((error,symbol,response) => {
       console.log(error);
       this.setState({'signal': "No internet connection"});
     });
  }

  render () {
    if(this.state.show=="yes"){
       return (
           <View style={styles.container}>
             <Symbol text={this.state.symbol} closePrice={this.state.closePrice}/>
             <HhRange text={this.state.dayRange} inverse={false} up={65} down={35}/>
             <HhRange text={this.state.hhRange} inverse={false} up={85} down={15}/>
             <HhRange text={this.state.sevenRange_low} inverse={false} up={50} down={30}/>
             <HhRange text={this.state.sevenRange_high} inverse={false} up={70} down={50}/>
             <Volume VolChange={this.state.volChange} VolPer={this.state.volPer} DayRange={this.state.dayRange}/>
             <Volatility text={this.state.shares}/>
           </View>
         )
        }
        else{
          return (
            null
          )
        }
      }
  }


  export default StockRow;
