import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Promise } from "meteor/promise";

import ReactiveAggregate from 'meteor/pedrolucasoliva:reactive-aggregate';
import cheerio from "cheerio";
import {CandlesCollection} from "/imports/Candles/Candles";
export const IdeasCollection = new Mongo.Collection('ideas');



Ideas({
  share: ["query"],
  autorun(){
  },
  ideas(){
    return IdeasCollection.find().fetch();
  },
  render(){
    <div className="row">
      <div className="col-md-6" ></div>
    </div>
  }
});

if(Meteor.isServer){

  IdeasCollection.rawCollection().createIndex({ date: -1 });

  Meteor.publish("ideas", (q, options)=>{
    return IdeasCollection.find(q, options);
  })


  Meteor.methods({
    "trader.ideas.findPrice"(username="duot", pair="BTCUSD"){
      let unpriced = IdeasCollection.findOne({username, date: {$gte: new Date("2018-08-10")}, pair, price: null});
        //console.log("unpriced", unpriced);
      if(!unpriced) return;
      let nearestCandle = CandlesCollection.find({date: {$lte: unpriced.date}}, {sort: {date: -1}, limit: 1}).fetch();
    //  console.log("nearestCandle", nearestCandle);
      if(nearestCandle && nearestCandle[0]){
      IdeasCollection.update({_id: unpriced._id}, {$set: {price: nearestCandle[0].close}}, (e,res)=>{
        console.log(unpriced.title, unpriced.date, nearestCandle[0].close);
      });
      Meteor.setTimeout(()=>{
          Meteor.call("trader.ideas.findPrice", username, pair);
      }, 100);
    }
    },
    "ideas.findPrice"( pair="BTCUSD"){
      let unpriced = IdeasCollection.findOne({date: {$gte: new Date("2018-08-10")}, pair, price: null});
        //console.log("unpriced", unpriced);
      if(!unpriced) return;
      let nearestCandle = CandlesCollection.find({date: {$lte: unpriced.date}}, {sort: {date: -1}, limit: 1}).fetch();
    //  console.log("nearestCandle", nearestCandle);
      if(nearestCandle && nearestCandle[0]){
      IdeasCollection.update({_id: unpriced._id}, {$set: {price: nearestCandle[0].close}}, (e,res)=>{
        console.log(unpriced.title, unpriced.date, nearestCandle[0].close);
      });
      Meteor.setTimeout(()=>{
          Meteor.call("ideas.findPrice", pair);
      }, 100);
    }
    },
    "ideas.aggregate"(pipeline){
      console.log("ideas.aggregate", pipeline);
      var rawIdeas = IdeasCollection.rawCollection();
      let result = Promise.await(rawIdeas.aggregate(pipeline).toArray());
      return result;
    },
    "ideas.removeAll"(){
      IdeasCollection.remove({});
    },
    "ideas.insert"(idea){

      IdeasCollection.upsert({uid: idea.uid}, idea);
    },
    "ideas.scrap"(page, section="bitcoin"){

      HTTP.call('GET', `https://www.tradingview.com/ideas/${section}/page-${page}/?sort=recent`, {}, Meteor.wrapAsync((error, result) => {
        if (!error) {


          const $body = cheerio.load(result.content);
          const ideas = $body(".tv-feed__item");
            ideas.each((i, fi)=>{
              const $idea = cheerio.load(fi);
              const username = $idea(".tv-card-user-info__name").text();
              const pair= $idea(".tv-widget-idea__symbol").text();
              const date = new Date(parseFloat($idea(".tv-card-stats__time").data("timestamp"))*1000);
              const avatar =$idea(".tv-user-avatar__image").attr("src");
              const title = $idea(".tv-widget-idea__title").text().trim();
              const position = $idea(".tv-widget-idea__label").text().trim();
              const label =$idea(".tv-idea-label__icon").html();
              const like_count = $idea(".tv-social-row__start .tv-card-social-item__count").text();
              const comment_count = $idea(".tv-social-row__end .tv-card-social-item__count").text();
              const thumb= $idea(".tv-widget-idea__cover-link .tv-widget-idea__cover").data("src");
              const timeframe = $idea(".tv-widget-idea__timeframe").text().replace(",", "").trim();
              const widget_data = $idea(".tv-feed__item").data("widget-data");
              const uid = $idea(".tv-feed__item").data("uid");
              let idea = {uid, thumb, username, pair, timeframe, date, avatar, title, position, label, like_count, comment_count, widget_data};

              console.log(idea);
              console.log("-----------------");


              if(title && title!=="" && username && username !=="")
                Meteor.call("ideas.insert", idea);
            });
          }
        }));
    },
    "ideas.scrap.all"(a=1,b=56, section="bitcoin"){
      for(i=a; i<b; i++){
        Meteor.setTimeout(()=>{
            Meteor.call("ideas.scrap", i, section);
          }, i*3000);
        }
    }
  })
}
