import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'
import React from 'react';
import { render } from 'react-dom';
import { App } from '../imports/App';
import ViewModel from 'viewmodel-react';
import "bootstrap/dist/css/bootstrap";


// Use Meteor's dependency management
ViewModel.Tracker = Tracker;
ViewModel.share({
  query: {
    pair: "BTCUSD",
    timeframe: "1D",
  }
})
Meteor.startup(() => {
  render(<App />, document.getElementById('app'));
});
