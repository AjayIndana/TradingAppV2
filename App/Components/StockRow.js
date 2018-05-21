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
            var result = responseJson["chart"]["result"][0]["indicators"]["quote"][0]
            result["low"].reverse().shift(-1);
            result["high"].reverse().shift(-1);
            result["open"].reverse().shift(-1);
            result["close"].reverse().shift(-1);
            result["volume"].reverse().shift(-1);
            this.setState({'prevHighPrice': result["high"][0]});
            this.setState({'prevLowPrice': result["low"][0]});
            this.setState({'prevOpenPrice': result["open"][0]});
            this.setState({'prevClosePrice': result["close"][0]});
            this.setState({'oneHighPrice': result["high"][1]});
            this.setState({'oneLowPrice': result["low"][1]});
            this.setState({'oneOpenPrice': result["open"][1]});
            this.setState({'oneClosePrice': result["close"][1]});

            var lowp = result["low"];
            var count=1;
            var newLow = lowp[0];
            for(var i=1;i<lowp.length;i++){
              if(lowp[i]<=newLow){
                newLow = lowp[i];
                count = count+1;
              }
              else break;
            }

            this.setState({'count': count});

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
            this.setState({'sevenRange': ''});
            this.setState({'volumePercent': ''});
            this.setState({'updated': ''});
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

       var open = responseJson.map(function(n){
        // if(n.high!=0 && n.high!=-1) return n.high;
        return n["open"];
         });
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

                 var volume = responseJson.map(function(n){
                   return n["volume"]
                   });

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
                 // if(symbol=="AMD") {
                 //   console.log(prevVolume);
                 // }
             })
             .catch((error,symbol,response) => {
               console.log(error);
             });
           }.bind(this)

           fetchNow();
         }.bind(this)

       getPreviousVolume(symbol, open.length);

       var close = responseJson.map(function(n){
        // if(n.high!=0 && n.high!=-1) return n.high;
        return n["close"];
         });
       close=close.filter(function(n){ return n != undefined });

       var high = responseJson.map(function(n){
        // if(n.high!=0 && n.high!=-1) return n.high;
        return n["high"];
         });
       high=high.filter(function(n){ return n != undefined });
       var highPrice = high.reduce((max, n) => n > max ? n : max);
       if(closePrice > highPrice){
         highPrice = closePrice;
       }
       var high7 = high.slice(high.length-6, high.length);
       var highPrice7 = high7.reduce((max, n) => n > max ? n : max);
       if(closePrice > highPrice7){
         highPrice7 = closePrice;
       }
       var high15 = high.slice(high.length-14, high.length);
       var highPrice15 = high15.reduce((max, n) => n > max ? n : max);
       if(closePrice > highPrice15){
         highPrice15 = closePrice;
       }
       var high30 = high.slice(high.length-29, high.length);
       var highPrice30 = high30.reduce((max, n) => n > max ? n : max);
       if(closePrice > highPrice30){
         highPrice30 = closePrice;
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
       var low7 = low.slice(low.length-6, low.length);
       var lowPrice7 = low7.reduce((min, n) => n < min ? n : min)
       if(closePrice < lowPrice7){
         lowPrice7 = closePrice;
       }

       var low15 = low.slice(low.length-14, low.length);
       var lowPrice15 = low15.reduce((min, n) => n < min ? n : min)
       if(closePrice < lowPrice15){
         lowPrice15 = closePrice;
       }

       var low30 = low.slice(low.length-29, low.length);
       var lowPrice30 = low30.reduce((min, n) => n < min ? n : min)
       if(closePrice < lowPrice30){
         lowPrice30 = closePrice;
       }

       var open7 = open.slice(open.length-6, open.length);
       var openPrice7 = parseFloat(open7[0]).toFixed(2);
       this.setState({'openPrice7': openPrice7});
       var volume = responseJson.map(function(n){
         //if(n.volume!=0 && n.volume!=-1) return n.volume;
         return n["volume"]
         });

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

       var sellingPressDown = (openPrice<closePrice) ? Math.round(((openPrice-lowPrice)/(highPrice-lowPrice))*100) : Math.round(((closePrice-lowPrice)/(highPrice-lowPrice))*100);
       this.setState({'sellingPressDown': sellingPressDown});
       var sellingPressUp = (openPrice<closePrice) ? Math.round(((highPrice-closePrice)/(highPrice-lowPrice))*100) : Math.round(((highPrice-openPrice)/(highPrice-lowPrice))*100);
       this.setState({'sellingPressUp': sellingPressUp});
       var dayRange = 100 - (sellingPressUp+sellingPressDown);
       this.setState({'dayRange': dayRange});

       var sevenRange = Math.round(((closePrice-lowPrice7)/(highPrice7-lowPrice7))*100);
       this.setState({'sevenRange': sevenRange});

       var diff = parseFloat(closePrice-lowPrice7).toFixed(2);
       var sevenRangeVolUp = parseFloat((diff*100)/lowPrice7).toFixed(2);
       this.setState({'sevenRangeVolUp': sevenRangeVolUp});

       var diff2 = parseFloat(highPrice7-closePrice).toFixed(2);
       var sevenRangeVolDown = parseFloat((diff2*100)/highPrice7).toFixed(2);
       this.setState({'sevenRangeVolDown': sevenRangeVolDown});

       var createGroupedArray = function(arr, chunkSize) {
         var groups = [], i;
         for (i = 0; i < arr.length; i += chunkSize) {
             groups.push(arr.slice(i, i + chunkSize));
         }
         return groups;
       }

       var low_as_arr_rv = createGroupedArray(low.slice().reverse(), 5);
       var low_as_arr = low_as_arr_rv.slice().reverse();
       var high_as_arr_rv = createGroupedArray(high.slice().reverse(), 5);
       var high_as_arr = high_as_arr_rv.slice().reverse();
       var low_as_p = low_as_arr.map(function(n){
         return Math.min.apply(null,n);
       });
       var high_as_p = high_as_arr.map(function(n){
         return Math.max.apply(null,n);
       });


       var h_outs=[], h_old_outs=[], h_in_outs=[], L= high_as_p.length, j=0, h_prev, h_lh, h_hh, h_ol=0;
       while(j<L){
           h_old_outs=h_in_outs;
           if(h_old_outs.length>0) {
             h_ol = Math.min.apply(null,h_old_outs);
           }
           h_in_outs=[];
           h_prev= high_as_p[i];
           while(high_as_p[++i]<h_prev) h_in_outs.push(high_as_p[i]);
           h_outs = h_in_outs;
           if(h_in_outs.length>0) {
             h_lh = Math.min.apply(null,h_in_outs);
             h_hh = 0;
           }
           else {
             h_hh = prev;
             h_lh = 0;
           }
       }

       var outs=[], old_outs=[], in_outs=[], L= low_as_p.length, i=0, prev, lh, hh, ol=0;
       while(i<L){
           old_outs=in_outs;
           if(old_outs.length>0) {
             ol = Math.min.apply(null,old_outs);
           }
           in_outs=[];
           prev= low_as_p[i];
           while(low_as_p[++i]<prev) in_outs.push(low_as_p[i]);
           outs = in_outs;
           if(in_outs.length>0) {
             lh = Math.min.apply(null,in_outs);
             hh = 0;
           }
           else {
             hh = prev;
             lh = 0;
           }
       }

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
     if(hh>0 || newLow>1.2*lh || (newLow>=lh && lh>1.2*ol)) {
       if(h_hh>0 || closePrice>=h_lh) {
         is_buy = 1;
      }
     }
    this.setState({'is_buy': is_buy});

     var predPrice = parseFloat(newLow+(newLow*0.0035)).toFixed(2);
     var highPredPrice = parseFloat(newLow+(newLow*0.011)).toFixed(2);
     this.setState({'predPrice': predPrice});
     var newdiff = parseFloat(closePrice-newLow).toFixed(2);
     var newVol = parseFloat((diff*100)/newLow).toFixed(2);
     this.setState({'newVol': newVol});

     var higharr = createGroupedArray(high.slice().reverse(), 5);
     var highp = higharr.map(function(n){
       return Math.max.apply(null,n);
     });
     var newHigh = highp[0];
     for(var i=1;i<highp.length;i++){
       if(highp[i]>=newHigh){
         newHigh = highp[i];
       }
       else break;
     }
     if(newHigh<closePrice) newHigh=closePrice;
     this.setState({'newHigh': parseFloat(newHigh).toFixed(2)});

     var maxbottom = parseFloat(newHigh-(newHigh*0.007)).toFixed(2);
     this.setState({'maxbottom': maxbottom});

     var highper = parseFloat(((highPrice-closePrice)*100)/highPrice).toFixed(2);
     this.setState({'highper': highper});

      var today = new Date();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      this.setState({'updated': time});

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

        if((closePrice>this.state.prevHighPrice || highPredPrice>this.state.prevHighPrice) && (this.state.volChange=="up" || this.state.volPer<20) && lowPrice>this.state.prevLowPrice && (this.state.prevLowPrice<this.state.oneLowPrice || this.state.prevHighPrice<this.state.oneHighPrice)){
          this.setState({'buy': "Buy"});
        }
        else if((closePrice>this.state.prevHighPrice || highPredPrice>this.state.prevHighPrice) && (this.state.volChange=="up" || this.state.volPer<20) && this.state.prevClosePrice>this.state.prevOpenPrice && this.state.oneClosePrice>this.state.oneOpenPrice && lowPrice>this.state.prevLowPrice && this.state.prevLowPrice>this.state.oneLowPrice && this.state.prevHighPrice>this.state.oneHighPrice && this.state.count<5){
          this.setState({'buy': "Buy"});
        }
        else {
          this.setState({'buy': "NA"});
        }
     })
     .catch((error,symbol,response) => {
       console.log(error);
     });
  }

  render () {
    if(this.state.buy=="Buy" && this.state.is_buy==1 && this.state.bullVolSum>0.8*this.state.bearVolSum && this.state.closePrice>this.state.newLow && this.state.closePrice>this.state.maxbottom){
      return (
          <View style={styles.container}>
            <Symbol text={this.state.symbol}/>
            <Updated closePrice={this.state.closePrice}/>
            <Buy text={this.state.shares}/>
            <Range lowPrice={this.state.newLow} predPrice={this.state.predPrice}/>
            <SevenRangeVol up={this.state.sevenRangeVolUp} down={this.state.sevenRangeVolDown}/>
            <HighPer text={this.state.highper}/>
            <Updated closePrice={this.state.limit}/>
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
