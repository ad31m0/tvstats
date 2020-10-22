import cheerio from "cheerio";
import {IdeasCollection} from '/imports/Ideas/Ideas';
import {TradersCollection} from '/imports/Traders/Traders';
import {Link} from "react-router-dom"

Trader({
  url(){
    return  `/trader/${this.props._id}`;
  },
  scrap(){
      Meteor.call("trader.scrap.ideas.all", this.props._id, 10);
  },
  render(){
    return <div >

      <a href={`https://tradingview.com/u/${this.props._id}`}>{this.props._id} </a>

-
      <a href="#" b="click: scrap()">refresh</a>
-
      <Link to={this.url()}>
       {this.props.count}
      </Link>


    </div>
  }
});

if(Meteor.isServer){

  Meteor.publish("trader.trades", (query)=>{
    console.log("trader.trades", query);
    return IdeasCollection.find(query);
  })



  SyncedCron.add({
    name: 'Daily Scrap Trader',
    schedule: function(parser) {
      return parser.text('every 12 hours');
    },
    job: function() {
      Meteor.call("trader.scrap.lastUpdated");
    }
  });

  Meteor.methods({
    "trader.updateHistory"(username="duot", pair="BTCUSD"){
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

        let results = {username, win, loss, positions: win+loss, ratio: win/(1.0*loss), success: win/((1.0)*win+loss) };

        console.log(results);
        TradersCollection.update({username}, {$set: results});
      }
    },
    "trader.scrap.lastUpdated"(){
      let lastUpdated = TradersCollection.find({lastUpdated: {$ne: null}}, {$sort: {lastUpdated: -1}, $limit: 1}).fetch();
      console.log("lastUpdated", lastUpdated);
    },
    "trader.insert"(trader){
      TradersCollection.upsert({uid: trader.uid}, trader);
    },
    "trader.scrap.ideas.all"(trader="EXCAVO", pages=10){
      let i=0;
      for(i=1; i<=pages; i++){
        let c = i;
        Meteor.setTimeout(()=>{
          let cc = c;
          Meteor.call("trader.scrap.ideas", trader, c);
        }, i*5000);
      }
    },

    "trader.scrap.ideas"(trader, page=1){
    TradersCollection.update({username: trader}, {$set: {lastScrapped: true}}, {multi: true}, (e,s)=> {
      console.log("update lastScrapped", e, s, {username: trader})
    });

      let url = `https://www.tradingview.com/u/${trader}/page-${page}/`;
      console.log(  "trader.scrap.ideas", page, url);
      HTTP.call('GET', url, {followRedirects: false}, Meteor.wrapAsync((error, result) => {
        if (!error) {

          console.log("statusCode", result.statusCode)

          const $body = cheerio.load(result.content);
          const ideas = $body(".tv-feed__item");
            ideas.each((i, fi)=>{

              Meteor.setTimeout(()=>{
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

                  if(i == ideas.length-1){
                    console.log("final idea", username, page, i, idea.length-1);

                if(title && title!=="" && username && username !==""){

                  Meteor.call("ideas.insert", idea);

                }

              }else{
                console.log("idea", username, page, i, idea.length-1);
                if(title && title!=="" && username && username !==""){

                  Meteor.call("ideas.insert", idea);
                }
              }


            }, i*150);




            });

        }
      }));
    }
  });
}
