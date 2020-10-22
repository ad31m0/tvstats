export const TraderAssetsCollection = new Mongo.Collection('traderasset');
import {GridTable} from "/imports/GridTable/GridTable";
import {TradersCollection} from "/imports/Traders/Traders";
import {IdeasCollection} from "/imports/Ideas/Ideas";
TraderAssets({
  share: ["query"],
  created(){
    Meteor.subscribe("trader.assets", this.query());
  },
  query(){
    return {pair: this.pair()};
  },
  rows(){
    return TraderAssetsCollection.find(this.query()).fetch();
  },
  options(){
    return {};
  },
  columns(){
    return [
       {name: "avatar", label: "Avatar",
       options: {
         customBodyRender: (value, tableMeta, updateValue) => {
           return <img src={value} style={{height: "20px"}}/>;
         }
       }
     },
       {name: "username", label: "Username"},
       {name: "position", label: "Position"},
       {name: "success", label: "Success"},
       {name: "ratio", label: "Ratio"},
       {name: "win", label: "Wins"},
       {name: "loss", label: "Loss"},
       {name: "pair", label: "Pair"},

      ];
  },

  render(){

    return(
      <div className="row">
        <div className="col-md-5">
        <TraderAssetsByPosition/>

        </div>
      <div className="col-md-7">
        <GridTable  actions={[]} creatable={true} editable={true} rows={this.rows()} collection={TradersCollection} title="Traders" sub="traders" options={this.options()} query={this.query()} columns={this.columns()}/>
      </div>
      </div>
      );
  }
})


if(Meteor.isServer){
  Meteor.publish("trader.assets", (query)=>{
    let cursor = TraderAssetsCollection.find(query, {sort: {sucess: -1}});
    console.log("trader.assets", cursor.fetch(), query);
    return cursor;
  });
  Meteor.methods({
    "traders.assets.aggregate"(pipeline){
      console.log("traders.assets.aggregate", pipeline);
      var rawIdeas = TraderAssetsCollection.rawCollection();
      let result = Promise.await(rawIdeas.aggregate(pipeline).toArray());
      return result;
    },
    "update.pairs"(){
      TraderAssetsCollection.update({}, {$set: {pair: "BTCUSD"}}, {multi: true});
    },
    "traders.update.all.history"(pair){
        Meteor.call("ideas.aggregate", [
          {$match: {pair, position: {$in: ["Short", "Long"]}}},
          {$group: {_id: "$username", count: {$sum: 1}}},
          {$sort: {count: -1}}
        ], (e, res)=>{
          let usernames = res.map((t)=> t._id);
          console.log("traders.update.all.history", usernames)
            Meteor.call("traders.assets.update.history", usernames);
          }
        );


    },
    "traders.assets.update.history"(usernames){
      usernames.forEach((item, i) => {
        Meteor.setTimeout(()=>{

          Meteor.call("trader.assets.update.history", item);
        }, i*1000);
      });

    },
    "trader.assets.update.history"(username="duot", pair="BTCUSD"){
      // only closes a trade after an opposite position is opened..

      let win = 0;
      let loss = 0;
      let trades = IdeasCollection.find({date: {$gte: new Date("2018-08-10")}, username, pair, position: {$in: ["Long", "Short"]}}, {sort: {date: 1}}).fetch();
      if(trades && trades.length > 1){
        let current_position = trades[0].position;
        console.log(trades[0]);

        trades.forEach((trade, i) => {
              if(!i) return;
              console.log("trade", trade.position, trade.date, trade.price)
              if(trade.position !== trades[i-1].position){

                // close trade
                if(trade.position==="Short"){
                  console.log("close long");
                  if(trade.price > current_position.price){
                    win++;
                      console.log("win++", win);
                  }else{
                    loss++;
                      console.log("loss++", loss);
                  }
                } else{
                  console.log("close short");
                  if(trade.price < current_position.price){
                    win++;
                    console.log("win++", win);
                  }else{
                    loss++;
                      console.log("loss++", loss);
                  }
                }
                current_position = trade;
              }
        });

        let results = {username, win, loss, current_position, position: current_position.position,  positions: win+loss, ratio: win/(1.0*loss), success: win/((1.0)*win+loss) };

        console.log(results);
        TraderAssetsCollection.upsert({username, pair}, {$set: results});
      }
    }
  });
}
