
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
export const CandlesCollection = new Mongo.Collection('candles');
import moment from "moment";


Candles({
  created(){
  },
  candles(){
    return CandlesCollection.find().fetch();
  },
  render(){
    <div className="row">
    {this.candles().map((candle)=>{
      return   <div key={candle._id._str} className="col-sm-12 col-md-6 col-lg-4 col-xl-3">
        <Candle  candle={candle}/>
      </div>
    })}
    </div>
  }
});

if(Meteor.isServer){


  Meteor.publish("candles", (query={}, options={})=>{
    return CandlesCollection.find(query, options);
  });

  Meteor.methods({
    "candles.reset.all"(q={}){
      CandlesCollection.update({}, {$unset: {trades: 1}}, {multi: true});
    },
    "candles.remove.all"(q={}){
      CandlesCollection.remove(q);
    },
    "candles.aggregate.ideas"(timeframe= "1D"){
        let candle = CandlesCollection.findOne({timeframe, trades: {$exists: false}});
      //   let timeframeDates = {
      //     "1M": (candle)=>{
      //       return {
      //         $gte: moment(candle.date).startOf("minute").toDate(),
      //         $lte: moment(candle.date).endOf("minute").toDate()
      //       };
      //     },
      //     "1W": (candle)=>{
      //       return {
      //         $gte: moment(candle.date).startOf("week").toDate(),
      //         $lte: moment(candle.date).endOf("week").toDate()
      //       };
      //     },
      //
      // }
        let unit = (timeframe == "1M" ? "minute" : (timeframe == "1D" ? "day" : (timeframe == "1W" ? "week" : "month")));
        console.log("aggregating candles", unit, candle)
        if(!candle)
          return;
        let pipeline =  [
            {
              $match: {
                pair: candle.pair,
                date: {
                  $gte: moment(candle.date).startOf(unit).toDate(),
                  $lte: moment(candle.date).endOf(unit).toDate()

                }
              }
            },
            {
              $group: {
                _id: "$position",
                count: {
                  $sum: 1
                }
              }
            },
          ];

          Meteor.call("ideas.aggregate", pipeline, (e,res)=>{
            let update = {};
            let trades = 0;
            res.forEach((c)=>{
              trades += c.count;
              c._id = c._id == "" ? "Neutral" : c._id;
              update[c._id] = c["count"];
            })
            update.trades = trades;
            console.log("update", update)
            CandlesCollection.update({_id: candle._id}, {$set: update});

            Meteor.setTimeout(()=>{

              Meteor.call('candles.aggregate.ideas')
            }, 20);

          });
    },
    "candles.aggregate"(pipeline){
      var rawIdeas = CandlesCollection.rawCollection();
      let result = Promise.await(rawIdeas.aggregate(pipeline).toArray());
      return result;
    },
      "candles.remove.all"(q={}){
      CandlesCollection.remove(q, (e,s)=>{
        console.log("candles.remove.all", q, e, s);
      });
    },
    "candles.scrap.all"(first="BTC", second="USD", timeframe="1D"){
      let url = `https://dev-api.shrimpy.io/v1/exchanges/coinbasepro/candles?quoteTradingSymbol=${second}&baseTradingSymbol=${first}&interval=${timeframe}`
      HTTP.call("GET", url, {}, (e, res)=>{
        let candles = res.data;
        candles.forEach((c, i) => {
          Meteor.setTimeout(()=> {
            console.log(c,i);
            Meteor.call("candles.insert", c, first, second, timeframe);
          }, 30*i);
        });

      });
    }

  });

}
