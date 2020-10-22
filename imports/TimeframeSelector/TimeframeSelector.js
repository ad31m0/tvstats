TimeframeSelector({
  share: ["query"],
  timeframesList: [
      {label: "1W", minutes: "10080"},
    {label: "1D", minutes: "1440"},
    {label: "6H", minutes: "360"},
    {label: "1H", minutes: "60"},
  {label: "15M", minutes: "15"},

  ],

  created(){
    let that = this;
    // Meteor.call("ideas.aggregate", this.getPipeline(), (res,er)=>{
    //   console.log("ideas.aggregate", res, er);
    //   that.ideasList(er[0].children);
    //   that.ideasCount(er[0].count);
    // })
  },
  // getPipeline(){
  //   return [
  //     {$match: {}},
  //     {$group: {
  //       _id: {username: "$username", pair: "$pair"},
  //
  //       count: {$sum: 1}
  //     }},
  //     {$group: {
  //       _id: "$_id.pair",
  //       count: {$sum: "$count"},
  //       children: { $push : "$$ROOT" }
  //     }},
  //     {$sort: {count: -1}},
  //     {$limit: 100},
  //     {$group: {
  //       _id: null,
  //       count: {$sum: "$count"},
  //       children: { $push : "$$ROOT" }
  //
  //     }}
  //
  //
  //   ]
  // },
  changeTimeframe(timeframe){
    this.timeframe(timeframe);
  },
  render(){
    return (
        <select className={this.props.klass} b="value: timeframe, change: changeTimeframe">
          <option b="repeat: timeframesList, key: label, value: repeatObject.label">{repeatObject.label}</option>
        </select>
    );
  }
});
