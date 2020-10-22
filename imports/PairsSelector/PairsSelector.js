
PairsSelector({
  share: ["query"],
  ideasList: [],
  ideasCount: 0,
  created(){
    let that = this;
    Meteor.call("ideas.aggregate", this.getPipeline(), (res,er)=>{
      console.log("ideas.aggregate", res, er);
      that.ideasList(er[0].children);
      that.ideasCount(er[0].count);
    })
  },
  getPipeline(){
    return [
      {$match: {}},
      {$group: {
        _id: {username: "$username", pair: "$pair"},

        count: {$sum: 1}
      }},
      {$group: {
        _id: "$_id.pair",
        count: {$sum: "$count"},
        children: { $push : "$$ROOT" }
      }},
      {$sort: {count: -1}},
      {$limit: 100},
      {$group: {
        _id: null,
        count: {$sum: "$count"},
        children: { $push : "$$ROOT" }

      }}


    ]
  },
  changePair(pair){
    this.pair(pair);
  },
  render(){
    return (
        <select className={this.props.klass} b="value: pair, change: changePair">
          <option b="repeat: ideasList, key: _id, value: repeatObject._id">{repeatObject._id} ({repeatObject.count})</option>
        </select>
    );
  }
});
