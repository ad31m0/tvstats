import {IdeasCollection} from '/imports/Ideas/Ideas';
import {Idea} from "/imports/Ideas/Idea/Idea";
TraderProfile({
  share: ["query"],
  created(){
  },
  autorun(){
    Meteor.subscribe("trader.trades", {username: this.props.match.params.id, pair: this.pair()});

  },
  ideas(){
    return IdeasCollection.find({});
  },
  render(){
    <div>
    <span>{this.props.match.params.id}</span>

    <Idea b="repeat: ideas, key: _id" idea={repeatObject}/>

    </div>
  }
})
