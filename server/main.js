import { Meteor } from 'meteor/meteor';

import {IdeasCollection} from '/imports/Ideas/Ideas';
import {TradersCollection} from '/imports/Traders/Traders';
import {CandlesCollection} from '/imports/Candles/Candles';
import {TradersAssetsCollection} from "/imports/TraderAssets/TraderAssets";
import '/imports/Traders/Trader/Trader';

Meteor.startup(() => {
  SyncedCron.start();

});


SyncedCron.add({
  name: 'Daily Scrap Ideas',
  schedule: function(parser) {
    return parser.text('every 12 hours');
  },
  job: function() {
    Meteor.call("ideas.scrap.all", 1, 50, "bitcoin");
  }
});
