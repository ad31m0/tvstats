import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import cheerio from "cheerio";
export const TradersCollection = new Mongo.Collection('traders');

import {GirdTable} from "/imports/GridTable/GridTable";
Traders({
  share: ["query"],
  traders: [],
  fetchTraders(){
    Meteor.call("ideas.aggregate", [
      {$match: {pair: this.pair(), position: {$in: ["Short", "Long"]}}},
      {$group: {_id: "$username", count: {$sum: 1}}},
      {$sort: {count: -1}}
    ], (e, res)=>{
      console.log("ideas.aggregate", res, e);
      let ids = res.map((t)=> t._id);
      console.log(JSON.stringify(ids));
      this.traders(res);
    });
  },
  tradersList(){
    return TradersCollection.find({}).fetch();
  },
  created(){
    Meteor.subscribe("traders", {positions: {$ne: null}});
    this.fetchTraders();

  },
  autorun(){
    this.fetchTraders();
  },
  render(){
    <div className="row">

      <div  className="col-sm-12">

      <TradersGrid rows={this.tradersList()}/>




      </div>

    </div>
  }
});

if(Meteor.isServer){
  Meteor.publish("traders", (q={})=>{
    return TradersCollection.find(q, {sort: {success: -1}});
  })


  Meteor.methods({



    "traders.scrap.ideas.all"(){
      let trader = TradersCollection.findOne({lastScrapped: {$exists: false}});
      console.log("traders.scrap.ideas.all",  trader.username);
      if(trader){
        Meteor.call("trader.scrap.ideas", trader.username);
      }

      Meteor.setTimeout(()=>{
        Meteor.call(    "traders.scrap.ideas.all")
      }, 20000);
    },


    "traders.removeAll"(){
      TradersCollection.remove({});
    },
    "traders.insert"(trader){

      TradersCollection.upsert({username: trader.username}, trader);
    },

    "chat.traders.scrap"(room ="bitcoin"){
          let url = `https://www.tradingview.com/chat/history/?room=${room}&order=desc`;



              HTTP.call('GET', url, {}, Meteor.wrapAsync((error, result) => {
                if (!error) {



                  const $body = cheerio.load(result.content);
                  const traders = $body(".ch-item");
                    traders.each((i, fi)=>{
                      const $trader = cheerio.load(fi);
                      const avatar = $trader(".ch-item-userpic img").attr("src");

                      const username= $trader(".ch-userlink").text();


                      // const last_seen = new Date(parseFloat($trader(".tv-card-stats__time").data("timestamp"))*1000);
                      //const avatar =$trader(".tv-user-block__avatar-wrap img").attr("src");
                      // const title = $trader(".tv-widget-trader__title").text().trim();
                      // const position = $trader(".tv-widget-trader__label").text().trim();
                      // const label =$trader(".tv-trader-label__icon").html();
                      // const like_count = $trader(".tv-social-row__start .tv-card-social-item__count").text();
                      // const comment_count = $trader(".tv-social-row__end .tv-card-social-item__count").text();
                      // const thumb= $trader(".tv-widget-trader__cover-link .tv-widget-trader__cover").data("src");
                      // const timeframe = $trader(".tv-widget-trader__timeframe").text().replace(",", "").trim();
                      // const widget_data = $trader(".tv-feed__item").data("widget-data");
                      //const uid = $trader(".js-profile-message").data("id");
                      let trader = {username,avatar};

                      console.log(trader);
                      console.log("-----------------");


                      if(username && username !=="")
                        Meteor.call("traders.insert", trader);
                    });
                  }
                }));

    },
    "traders.scrap"(page, section="day"){

      HTTP.call('GET', `https://www.tradingview.com/people/${section}/page-${page}/`, {}, Meteor.wrapAsync((error, result) => {
        if (!error) {



          const $body = cheerio.load(result.content);
          const traders = $body(".tv-user-block");
            traders.each((i, fi)=>{
              const $trader = cheerio.load(fi);
              const username = $trader(".tv-user-block__name").text();
              const badge= $trader(".tv-badge__icon").html();
              const location = $trader("tv-user-block__info-text--not-hoverable").text();

              const website = $trader(".tv-user-block__info-icon--web").attr("href");
              const twitter = $trader(".tv-user-block__info-icon tv-user-block__info-icon--twitter").attr("href");


              const followers = $trader(".tv-user-block__stats-item [title='Followers']").text();
              const ideas = $trader(".tv-user-block__stats-item [title='Ideas']").text();
              const reputation = $trader(".tv-user-block__stats-item [title='Reputation']").text();


              // const last_seen = new Date(parseFloat($trader(".tv-card-stats__time").data("timestamp"))*1000);
              const avatar =$trader(".tv-user-block__avatar-wrap img").attr("src");
              // const title = $trader(".tv-widget-trader__title").text().trim();
              // const position = $trader(".tv-widget-trader__label").text().trim();
              // const label =$trader(".tv-trader-label__icon").html();
              // const like_count = $trader(".tv-social-row__start .tv-card-social-item__count").text();
              // const comment_count = $trader(".tv-social-row__end .tv-card-social-item__count").text();
              // const thumb= $trader(".tv-widget-trader__cover-link .tv-widget-trader__cover").data("src");
              // const timeframe = $trader(".tv-widget-trader__timeframe").text().replace(",", "").trim();
              // const widget_data = $trader(".tv-feed__item").data("widget-data");
              const uid = $trader(".js-profile-message").data("id");
              let trader = {uid, username, badge, location, website, twitter, followers, ideas, reputation, avatar};

              console.log(trader);
              console.log("-----------------");


              if(username && username !=="")
                Meteor.call("traders.insert", trader);
            });
          }
        }));
    },
    "traders.scrap.all"(a=1,b=5){
      for(i=a; i<b; i++){
        Meteor.setTimeout(()=>{
            Meteor.call("traders.scrap", i, "day");
          }, i*5000);

        Meteor.setTimeout(()=>{
            Meteor.call("traders.scrap", i, "week");
          }, i*10000);

        Meteor.setTimeout(()=>{
            Meteor.call("traders.scrap", i, "month");
          }, i*15000);
        }
    }
  })
}
