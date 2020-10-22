import {CandlesCollection} from "/imports/Candles/Candles"
Candle({
  render(){
    return (
      <div>
        {this.props.candle.pair} - {this.props.candle.time}
      </div>
    );

  }
})









if(Meteor.isServer){
  Meteor.methods({
    "candles.insert": (candle, first="BTC", second="USD", timeframe="1D")=>{

    let  candless = {
        ...candle,
        low: parseFloat(candle.low),
        high: parseFloat(candle.high),
        close: parseFloat(candle.close),
        open: parseFloat(candle.open),
        volume: parseFloat(candle.volume),
        date: new Date(candle.time)
      }
      CandlesCollection.upsert({pair: `${first}${second}`, time: candle.time, timeframe}, {
        ...candless,
        first,
        second,
        timeframe,
        pair: `${first}${second}`
      });
    }
  })
}
