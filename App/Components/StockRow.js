import React, { Component } from 'react'
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

export default class StockRow extends Component {

  constructor(props) {
    super(props);
    this.state = {
      symbol: props.symbol,
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
    }

    setInterval(() => {
      this.getClosePrice(this.state.symbol);
      //this.handlePushNotification();
      //this.updateRow(this.state.symbol);
    }, 20000);

    this.updateRow = this.updateRow.bind(this);
    this.getClosePrice = this.getClosePrice.bind(this);
    this.handlePushNotification = this.handlePushNotification.bind(this);
    this._onPressButton = this._onPressButton.bind(this);
    this.getPreviousPrice = this.getPreviousPrice.bind(this);
    //this.getPreviousVolume = this.getPreviousVolume.bind(this);
  }

  componentDidMount = () => {
    //this.getPreviousVolume(this.state.symbol);
    this.getPreviousPrice(this.state.symbol);
    this.getClosePrice(this.state.symbol);
    this.setState({'notify': true});
  }

  static propTypes = {
    symbol: PropTypes.string
  }

  handlePushNotification(symbol, status, time, shares){
    PushNotification.localNotification({
      message: symbol + " was a " + status + " at " + time + " Shares: " + shares
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

  async getPreviousPrice(symbol){
      return fetch('https://query1.finance.yahoo.com/v8/finance/chart/'+symbol+'?range=10d&includePrePost=false&interval=1d')
      .then((response) => response.json())
      .then((responseJson) => {
            var result = responseJson["chart"]["result"][0]["indicators"]["quote"][0];
            var closePrice=this.state.closePrice;
            var low = result["low"].slice().reverse();
            low.shift(-1);
            var high = result["high"].slice().reverse();
            high.shift(-1);
            var open = result["open"].slice().reverse();
            open.shift(-1);
            var close = result["close"].slice().reverse();
            close.shift(-1);
            this.setState({'prevHighPrice': high[0]});
            this.setState({'prevLowPrice': low[0]});
            this.setState({'prevOpenPrice': open[0]});
            this.setState({'prevClosePrice': close[0]});
            // this.setState({'oneHighPrice': high[1]});
            // this.setState({'oneLowPrice': low[1]});
            // this.setState({'oneOpenPrice': open[1]});
            // this.setState({'oneClosePrice': close[1]});
            // this.setState({'twoHighPrice': high[2]});
            // this.setState({'twoLowPrice': low[2]});
            // this.setState({'twoOpenPrice': open[2]});
            // this.setState({'twoClosePrice': close[2]});


            var lowestPrice = Math.min.apply(null,low);
            var highestPrice = Math.max.apply(null,high);

            var range = Math.round(((closePrice-lowestPrice)/(highestPrice-lowestPrice))*100);
            this.setState({'range': range});
        })
        .catch((error,symbol,response) => {
          console.log(error);
        });
    }

  async getClosePrice(symbol){
    if(symbol.includes("IXIC")){
      symbol = "IXIC";
      return fetch('https://www.nasdaq.com/quotedll/quote.dll?page=dynamic&mode=data&selected='+symbol+'&random='+Math.random())
        .then((response) => {
           var fields =  JSON.stringify(response);
            this.setState({'closePrice': JSON.parse(fields)["_bodyText"].split("|")[1]});
        })
        .then(() => {
          if(symbol.includes("IXIC")){
            symbol = "^IXIC";
          }
          this.updateRow(symbol)
        })
        .catch((error,symbol,response) => {
          console.log(error);
        });
    }
    else {
      return fetch('https://quote.cnbc.com/quote-html-webservice/quote.htm?symbols='+symbol+'&partnerId=2&requestMethod=quick&exthrs=1&noform=1&fund=1&output=jsonp&events=1&callback=quoteHandler1')
      .then((response) => {
            var result = JSON.parse(response["_bodyText"].split("quoteHandler1(")[1].slice(0, -1));
            this.setState({'closePrice': result["QuickQuoteResult"]["QuickQuote"]["last"]});
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

    return fetch(url)
     .then((response) => response.json())
     .then((responseJson) => {
       responseJson = responseJson["barData"]["priceBars"];

       var closePrice = this.state.closePrice;
       var range = this.state.range;
       var prevHighPrice = this.state.prevHighPrice;
       var prevLowPrice = this.state.prevLowPrice;
       var prevOpenPrice = this.state.prevOpenPrice;
       var prevClosePrice = this.state.prevClosePrice;
       // var oneHighPrice = this.state.oneHighPrice;
       // var oneLowPrice = this.state.oneLowPrice;
       // var oneOpenPrice = this.state.oneOpenPrice;
       // var oneClosePrice = this.state.oneClosePrice;
       // var twoHighPrice = this.state.twoHighPrice;
       // var twoLowPrice = this.state.twoLowPrice;
       // var twoOpenPrice = this.state.twoOpenPrice;
       // var twoClosePrice = this.state.twoClosePrice;

       var open = responseJson.map(function(n){ return n["open"] });
       open=open.filter(function(n){ return n != undefined });
       var openPrice = parseFloat(open[0]).toFixed(2);
       this.setState({'openPrice': openPrice});

       var getPreviousVolume = function(symbol, length){
         var count = 1;
         var prevVolume = 0;
         var fetchNow = function() {
           var yesterday = new Date();
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
                 if(volume.length>0){
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

       getPreviousVolume(symbol, open.length);

       var close = responseJson.map(function(n){ return n["close"] });
       close=close.filter(function(n){ return n != undefined });

       var high = responseJson.map(function(n){ return n["high"] });
       high=high.filter(function(n){ return n != undefined });
       var highPrice = high.reduce((max, n) => n > max ? n : max);
       if(closePrice > highPrice){ highPrice = closePrice; }

       var high30 = high.slice(high.length-30, high.length);
       var highPrice30 = high30.reduce((max, n) => n > max ? n : max);
       if(closePrice > highPrice30){ highPrice30 = closePrice; }

       var low = responseJson.map(function(n){ return n["low"] });
       low=low.filter(function(n){ return n != undefined });
       var lowPrice = low.reduce((min, n) => n < min ? n : min)
       if(closePrice < lowPrice){ lowPrice = closePrice; }

       var low30 = low.slice(low.length-30, low.length);
       var lowPrice30 = low30.reduce((min, n) => n < min ? n : min)
       if(closePrice < lowPrice30){
         lowPrice30 = closePrice;
       }

       var volume = responseJson.map(function(n){ return n["volume"] });

       volume=volume.filter(function(n){ return n != undefined });

       var todaysVolume = volume.reduce((a, b) => a + b, 0);
       var i=0;
       var bullVol = volume.filter(function(n) {
         if(open[i]>close[i]) {
           i=i+1;
           return 0;
         }
         else{
           i=i+1;
           return n;
         }
       });
       var bullVolSum = bullVol.reduce((a, b) => a + b, 0);
       this.setState({'bullVolSum': bullVolSum});
       var j=0;
       var bearVol = volume.filter(function(n) {
         if(open[j]<close[j]) {
           j=j+1;
           return 0;
         }
         else{
           j=j+1;
           return n;
         }
       });
       var bearVolSum = bearVol.reduce((a, b) => a + b, 0);
       this.setState({'bearVolSum': bearVolSum});
       this.setState({'todaysVolume': todaysVolume});

       var createGroupedArray = function(arr, chunkSize) {
         var groups = [], i;
         for (i = 0; i < arr.length; i += chunkSize) {
             groups.push(arr.slice(i, i + chunkSize));
         }
         return groups;
       }

       var low_as_arr_rv = createGroupedArray(low30.slice().reverse(), 5);
       var low_as_arr = low_as_arr_rv.slice().reverse();
       var high_as_arr_rv = createGroupedArray(high30.slice().reverse(), 5);
       var high_as_arr = high_as_arr_rv.slice().reverse();
       var low_as_p = low_as_arr.map(function(n){ return Math.min.apply(null,n) });
       var high_as_p = high_as_arr.map(function(n){ return Math.max.apply(null,n) });

       var goingUp = function(arr) {
         var L= arr.length, i=0, prev, hh, ol=0;
         while(i<L){
             var in_outs=[];
             prev=arr[i];
             while(arr[++i]<prev) in_outs.push(arr[i]);
             if(in_outs.length>0) {
               hh = 0;
             }
             else {
               hh = prev;
             }
         }
         return hh;
       }

       var isHammerOrBull = function(open, close, high, low) {
         var bottom_tag = 0;
         var up_tag = 0;
         var bull = 0;
          if(open>close){
            bottom_tag = Math.round(((close-low)/(high-low))*100);
            up_tag = Math.round(((high-open)/(high-low))*100);
          } else {
            bottom_tag = Math.round(((open-low)/(high-low))*100);
            up_tag = Math.round(((high-close)/(high-low))*100);
            bull = Math.round(((close-open)/(high-low))*100);
          }
          if((bottom_tag>50 && up_tag<15) || (bull>80 && up_tag<15)) return true;
          else return false;
       }

     var higher_high = goingUp(high_as_p);
     var lower_high = goingUp(low_as_p);
     // var one_bull = isHammerOrBull(oneOpenPrice, oneClosePrice, oneHighPrice, oneLowPrice);
     // var two_bull = isHammerOrBull(twoOpenPrice, twoClosePrice, twoHighPrice, twoLowPrice);
     var prev_bull = isHammerOrBull(prevOpenPrice, prevClosePrice, prevHighPrice, prevLowPrice);
     var today_bull = isHammerOrBull(openPrice, closePrice, highPrice, lowPrice);

     var lowarr = createGroupedArray(low.slice().reverse(), 5);

     var lowp = lowarr.map(function(n){
       return Math.min.apply(null,n);
     });
     var newLow = lowp[0];
     for(var i=1;i<lowp.length;i++){
       if(lowp[i]<=newLow){
         newLow = lowp[i];
       }
       else break;
     }

     if(newLow>closePrice) newLow=closePrice;
     this.setState({'newLow': parseFloat(newLow).toFixed(2)});

     var is_buy = 0;
     if(higher_high>0 && lower_high>0) {
         is_buy = 1;
     }

     var predPrice = parseFloat(newLow+(newLow*0.0035)).toFixed(2);
     this.setState({'predPrice': predPrice});

      var shares = Math.round(10000/closePrice);
      this.setState({'shares': shares});

      var limit = parseFloat(predPrice*0.005).toFixed(2);
      this.setState({'limit': limit});

      var volChange = this.state.todaysVolume - this.state.prevVolume;

      if(volChange>0) {
        var volPer = parseFloat((volChange/this.state.prevVolume)*100).toFixed(0);
        this.setState({'volPer': volPer});
        this.setState({'volChange': 'up'});
      }
      else {
        var volPer = parseFloat(((this.state.prevVolume - this.state.todaysVolume)/this.state.prevVolume)*100).toFixed(0);
        this.setState({'volPer': volPer});
        this.setState({'volChange': 'down'});
      }

      var up_tag = Math.round(((highPrice-closePrice)/(highPrice-lowPrice))*100);

        if(range<40 && is_buy == 1 && (prev_bull || today_bull)){
          this.setState({'buy': "Buy"});
        } else if(range>110 && is_buy == 1 && closePrice>openPrice && up_tag<10) {
          this.setState({'buy': "Buy"});
        } else {
          this.setState({'buy': "NA"});
        }
     })
     .catch((error,symbol,response) => {
       console.log(error);
     });
  }

  render () {
    if(this.state.buy=="Buy"){
      return (
          <View style={styles.container}>
            <Symbol text={this.state.symbol}/>
            <Updated closePrice={this.state.closePrice}/>
            <Buy text={this.state.shares}/>
            <Range lowPrice={this.state.newLow} predPrice={this.state.predPrice}/>
            <Volume VolChange={this.state.volChange} VolPer={this.state.volPer}/>
            <PushController />
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
