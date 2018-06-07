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
    }

    setInterval(() => {
      //this.getPreviousPrice(this.state.symbol);
      this.getClosePrice(this.state.symbol);
      //this.handlePushNotification();
      //this.updateRow(this.state.symbol);
    }, 30000);

    this.updateRow = this.updateRow.bind(this);
    this.getClosePrice = this.getClosePrice.bind(this);
    this.handlePushNotification = this.handlePushNotification.bind(this);
    this._onPressButton = this._onPressButton.bind(this);
    this.getPreviousPrice = this.getPreviousPrice.bind(this);
    this.getMarketPrice = this.getMarketPrice.bind(this);
  }

  componentDidMount = () => {
    this.getMarketPrice();
    this.getPreviousPrice(this.state.symbol);
    this.getClosePrice(this.state.symbol);
    this.setState({'notify': true});
  }

  static propTypes = {
    symbol: PropTypes.string
  }

  handlePushNotification(text){
    var todayDate = new Date().toISOString();
      PushNotification.localNotification({
        message: text + " " + this.state.symbol + " " + this.state.shares + " " + this.state.hhVolatility
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

  async getMarketPrice(symbol){
      return fetch('https://query1.finance.yahoo.com/v8/finance/chart/%5EIXIC?range=2d&includePrePost=false&interval=1d')
      .then((response) => response.json())
      .then((responseJson) => {
            var result = responseJson["chart"]["result"][0]["indicators"]["quote"][0];
            var open = result["open"];
            var close = result["close"];
            var todayOpen = parseFloat(open[1]).toFixed(2);
            var yesClose = parseFloat(close[0]).toFixed(2);
            var buffer = parseFloat(((todayOpen-yesClose)/yesClose)*100).toFixed(2);
            this.setState({'buffer': buffer});
        })
        .catch((error,symbol,response) => {
          console.log(error);
        });
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

            // var lowestPrice = Math.min.apply(null,low);
            // var highestPrice = Math.max.apply(null,high);
            //
            // var range = Math.round(((closePrice-lowestPrice)/(highestPrice-lowestPrice))*100);
            // this.setState({'range': range});
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
       var buffer = this.state.buffer;
       var closePrice = this.state.closePrice;
       //var range = this.state.range;
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

       var getDirection = function(low, blocks) {
          var lowarr = createGroupedArray(low.slice().reverse(), blocks);
          var direction = "";
           var lowp = lowarr.map(function(n){
             return Math.min.apply(null,n);
           });
           var initial = lowp[0];
           var i=1;
           for(i=1;i<lowp.length;i++){
             if(lowp[i]<=initial){
               initial = lowp[i];
             }
             else break;
           }
           if(initial == lowp[0]){
             direction = "down";
           } else {
             direction = "up";
           }
           return direction;
         }

       var newLowfun = function(low, high, blocks) {
          var lowarr = createGroupedArray(low.slice().reverse(), blocks);
          var higharr = createGroupedArray(high.slice().reverse(), blocks);
           var lowp = lowarr.map(function(n){
             return Math.min.apply(null,n);
           });
           var highp = higharr.map(function(n){
             return Math.max.apply(null,n);
           });
           var newLow = lowp[0];
           var i=1;
           for(i=1;i<lowp.length;i++){
             if(lowp[i]<=newLow){
               newLow = lowp[i];
             }
             else break;
           }
           var j=0;
           var newHigh = highp[i];
           for(j=i+1;j<highp.length;j++){
             if(highp[j]>=newHigh){
               newHigh = highp[j];
             }
             else break;
           }
           var k=0;
           var oldLow = lowp[j];
           for(k=j+1;k<lowp.length;k++){
             if(lowp[k]<=oldLow){
               oldLow = lowp[k];
             }
             else break;
           }
           var l=0;
           var oldHigh = highp[k];
           for(l=k+1;l<highp.length;l++){
             if(highp[l]>=oldHigh){
               oldHigh = highp[l];
             }
             else break;
           }
           return [parseFloat(newLow).toFixed(2),parseFloat(newHigh).toFixed(2),parseFloat(oldLow).toFixed(2),parseFloat(oldHigh).toFixed(2)];
       }

       var newHighfun = function(low, high, blocks) {
          var lowarr = createGroupedArray(low.slice().reverse(), blocks);
          var higharr = createGroupedArray(high.slice().reverse(), blocks);

          var lowp = lowarr.map(function(n){
            return Math.min.apply(null,n);
          });
           var highp = higharr.map(function(n){
             return Math.max.apply(null,n);
           });
           var i=1;
           var newHigh = highp[0];
           for(i=1;i<highp.length;i++){
             if(highp[i]>=newHigh){
               newHigh = highp[i];
             }
             else break;
           }

           var j=0;
           var newLow = lowp[i];
           for(j=i+1;j<lowp.length;j++){
             if(lowp[j]<=newLow){
               newLow = lowp[j];
             }
             else break;
           }

           var k=0;
           var oldHigh = highp[k];
           for(k=j+1;k<highp.length;k++){
             if(highp[k]>=oldHigh){
               oldHigh = highp[k];
             }
             else break;
           }

           var l=0;
           var oldLow = lowp[l];
           for(l=k+1;l<lowp.length;l++){
             if(lowp[l]<=oldLow){
               oldLow = lowp[l];
             }
             else break;
           }
           return [parseFloat(newLow).toFixed(2),parseFloat(newHigh).toFixed(2),parseFloat(oldLow).toFixed(2),parseFloat(oldHigh).toFixed(2)]
       }

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

       var createGroupedArray = function(arr, chunkSize) {
         var groups = [], i;
         for (i = 0; i < arr.length; i += chunkSize) {
             groups.push(arr.slice(i, i + chunkSize));
         }
         return groups;
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
          if((bottom_tag>50 && up_tag<35) || (bull>50 && up_tag<35)) return true;
          else return false;
       }

       var yesBull = function(open, close, high, low) {
         var tag = 0;
          if(close>open){
            tag = Math.round(((high-close)/(high-low))*100);
            if(tag<15) return true;
          } else {
            tag = Math.round(((close-low)/(high-low))*100);
            if(tag>25) return true;
          }
       }

       var yesBear = function(open, close, high, low) {
         var tag = 0;
          if(close<open){
            tag = Math.round(((close-low)/(high-low))*100);
            if(tag<15) return true;
          } else {
            tag = Math.round(((high-close)/(high-low))*100);
            if(tag>25) return true;
          }
       }

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
                 var close = responseJson.map(function(n){ return n["close"] });
                 close=close.filter(function(n){ return n != undefined });

                 if(volume.length>0){
                   var open = this.state.prevOpenPrice;
                   if(length>close.length){
                     length = close.length;
                   }
                   var prevVolatility = close[length-1] - open;
                   this.setState({'prevVolatility': prevVolatility});
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

       var open = responseJson.map(function(n){ return n["open"] });
       open=open.filter(function(n){ return n != undefined });
       var openPrice = parseFloat(open[0]).toFixed(2);
       this.setState({'openPrice': openPrice});

       var close = responseJson.map(function(n){ return n["close"] });
       close=close.filter(function(n){ return n != undefined });

       var high = responseJson.map(function(n){ return n["high"] });
       high=high.filter(function(n){ return n != undefined });
       var highPrice = high.reduce((max, n) => n > max ? n : max);
       if(closePrice > highPrice){ highPrice = closePrice; }

       var low = responseJson.map(function(n){ return n["low"] });
       low=low.filter(function(n){ return n != undefined });
       var lowPrice = low.reduce((min, n) => n < min ? n : min)
       if(closePrice < lowPrice){ lowPrice = closePrice; }

       var volume = responseJson.map(function(n){ return n["volume"] });
       volume=volume.filter(function(n){ return n != undefined });

      // var low_as_arr_rv = createGroupedArray(low30.slice().reverse(), 5);
      // var low_as_arr = low_as_arr_rv.slice().reverse();
      // var low_as_p = low_as_arr.map(function(n){ return Math.min.apply(null,n) });

     //var lower_high = goingUp(low_as_p);
     // var one_bull = isHammerOrBull(oneOpenPrice, oneClosePrice, oneHighPrice, oneLowPrice);
     // var two_bull = isHammerOrBull(twoOpenPrice, twoClosePrice, twoHighPrice, twoLowPrice);
     var prev_bull = yesBull(prevOpenPrice, prevClosePrice, prevHighPrice, prevLowPrice);
     var prev_bear = yesBear(prevOpenPrice, prevClosePrice, prevHighPrice, prevLowPrice);

     var is_up=0;
     var is_down=0;
     var array = [];

     var directionL = getDirection(low,3);
     var direction2L = getDirection(low.slice(0, -1),3);
     var direction2H = getDirection(high.slice(0, -1),3);
     var directionH = getDirection(high,3);
     var directionC = getDirection(close,3);
     var direction2C = getDirection(close.slice(0, -1),3);

     var direction = "neutral";
     var direction2 = "neutral";
     if(directionL=="up" && directionH=="up" && directionC=="up"){
       direction = "up";
     } else if(directionL=="down" && directionH=="down" && directionC=="down"){
       direction = "down";
     }
     if(direction2L=="up" && direction2H=="up" && direction2C=="up"){
       direction2 = "up";
     } else if(direction2L=="down" && direction2H=="down" && direction2C=="down"){
       direction2 = "down";
     }
     this.setState({'direction': direction});

     if(directionL == "up"){
       array = newLowfun(low,high,3);
     } else {
       array = newHighfun(low,high,3);
     }

     var newLow = array[0];
     var newHigh = array[1];
     var oldLow = array[2];
     var oldHigh = array[3];

     if(newLow>=oldLow && (closePrice>=newHigh || newHigh>=oldHigh) && closePrice>newLow) {
       is_up=1;
     } else if(newHigh<=oldHigh && (closePrice<=newLow || newLow<=oldLow) && closePrice<newHigh) {
       is_down=1;
     }

     //var today_bull = isHammerOrBull(openPrice, closePrice, highPrice, lowPrice);
     // if(symbol == "SQ" || symbol == "NFLX"){
     //   console.log(symbol);
     //   console.log(array);
     //   console.log(this.state.direction);
     //  // console.log(is_down);
     // }

     var stock_buffer = parseFloat(((openPrice-prevClosePrice)/prevClosePrice)*100).toFixed(2);

     var is_buy = 0;
     var is_sell = 0;
     //this.setState({'is_buy': is_buy});
     //range =10;
     if(openPrice>prevClosePrice && is_up==1 && stock_buffer>buffer && closePrice>openPrice && (prev_bull || newLow>prevHighPrice)){
       is_buy = 1;
       is_sell = 0;
       //if(direction=="up" && direction!=direction2){
        // this.handlePushNotification("Buy");
       //}
       this.setState({'is_buy': is_buy});
       this.setState({'is_sell': is_sell});
     } else if(openPrice<=prevClosePrice && is_down==1 && stock_buffer<buffer && closePrice<openPrice && (prev_bear || newHigh<prevLowPrice)){
       is_buy = 0;
       is_sell = 1;
       //if(direction=="down" && direction!=direction2){
        // this.handlePushNotification("Short");
       //}
       this.setState({'is_buy': is_buy});
       this.setState({'is_sell': is_sell});
     }

     if(is_buy == 1 || is_sell==1 ){
       getPreviousVolume(symbol, open.length);

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

       var high3 = high.slice(high.length-3, high.length);
       var highPrice3 = high3.reduce((max, n) => n > max ? n : max);
       if(closePrice > highPrice3){
         highPrice3 = closePrice;
       }
       var low3 = low.slice(low.length-3, low.length);
       var lowPrice3 = low3.reduce((min, n) => n < min ? n : min)
       if(closePrice < lowPrice3){
         lowPrice3 = closePrice;
       }
       var threeRange = Math.round(((closePrice-lowPrice3)/(highPrice3-lowPrice3))*100);
       this.setState({'threeRange': threeRange});

      
       var length = high.length-30;
       if(high.length<30){
         length=0;
       }
       var high30 = high.slice(length, high.length);
       var highPrice30 = high30.reduce((max, n) => n > max ? n : max);
       if(closePrice > highPrice30){
         highPrice30 = closePrice;
       }
       var low30 = low.slice(length, low.length);
       var lowPrice30 = low30.reduce((min, n) => n < min ? n : min)
       if(closePrice < lowPrice30){
         lowPrice30 = closePrice;
       }
       var open30 = open.slice(length, open.length);
       var openPrice30 = parseFloat(open30[0]).toFixed(2);

       var hhRange = Math.round(((closePrice-lowPrice30)/(highPrice30-lowPrice30))*100);
       this.setState({'hhRange': hhRange});

       var hhVolatility = Math.round(((highPrice30-lowPrice30)/closePrice)*100*100)/100;
       this.setState({'hhVolatility': hhVolatility});

       var dayRange = Math.round(((closePrice-lowPrice)/(highPrice-lowPrice))*100);
       this.setState({'dayRange': dayRange});

        var shares = Math.round(7000/closePrice);
        this.setState({'shares': shares});

       var todaysVolume = volume.reduce((a, b) => a + b, 0);
       this.setState({'todaysVolume': todaysVolume});
       
       var volChange = this.state.todaysVolume - this.state.prevVolume;
        var volPer = parseFloat((volChange/this.state.prevVolume)*100).toFixed(0);

        if(volChange>0){
          this.setState({'volPer': volPer});
          this.setState({'volChange': 'up'});
        } else {
          this.setState({'volPer': (-1*volPer)});
          this.setState({'volChange': 'down'});
        }

       if(volume.length>6){
         var vol6 = volume.slice(volume.length-3, volume.length);
         vol6_sum = vol6.reduce((a, b) => a + b, 0);
         var vol3 = volume.slice(volume.length-6, volume.length-3);
         vol3_sum = vol3.reduce((a, b) => a + b, 0);
         if(vol6_sum>vol3_sum){
            var vol6_sig = "up";
            if((directionL=="down" || (directionL=="up" && direction2L=="down")) && is_buy==1 && volChange>0 && hhVolatility>0.35 && threeRange>70) {
            this.handlePushNotification("Buy");
            }
            if((directionH=="up" || (directionH=="down" && direction2H=="up")) && is_sell==1 && volChange>0 && hhVolatility>0.35 && threeRange<30) {
            this.handlePushNotification("Short");
            }
            this.setState({'vol6_sig': vol6_sig});
            var vol6_Per = parseFloat(((vol6_sum - vol3_sum)/vol3_sum)*100).toFixed(0);
            this.setState({'vol6_Per': vol6_Per});
         } else {
             var vol6_sig = "down";
             var vol6_Per = parseFloat(((vol3_sum - vol6_sum)/vol3_sum)*100).toFixed(0);
             this.setState({'vol6_sig': vol6_sig});
             this.setState({'vol6_Per': vol6_Per});
         }
      }


      }

     })
     .catch((error,symbol,response) => {
       console.log(error);
     });
  }

  render () {
    if(this.state.is_buy==1){
      return (
          <View style={styles.container}>
            <Symbol text={this.state.symbol} signal="Buy"/>
            <Buy text={this.state.shares}/>
            <HhRange text={this.state.dayRange}/>
            <HhRange text={this.state.hhRange}/>
            <HhRange text={this.state.threeRange}/>
            <Volatility text={this.state.hhVolatility} direction={this.state.direction}/>
            <Volume VolChange={this.state.volChange} VolPer={this.state.volPer}/>
            <Volume VolChange={this.state.vol6_sig} VolPer={this.state.vol6_Per}/>
            <PushController />
          </View>
        )
      } else if(this.state.is_sell==1){
        return (
            <View style={styles.container}>
              <Symbol text={this.state.symbol} signal="Short"/>
              <Buy text={this.state.shares}/>
              <HhRange text={this.state.dayRange}/>
              <HhRange text={this.state.hhRange}/>
              <HhRange text={this.state.threeRange}/>
              <Volatility text={this.state.hhVolatility} direction={this.state.direction}/>
              <Volume VolChange={this.state.volChange} VolPer={this.state.volPer}/>
              <Volume VolChange={this.state.vol6_sig} VolPer={this.state.vol6_Per}/>
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


  export default StockRow;
