TraderAssetsByPosition({
  share: ["query"],
  tradersByPosition: [],

  created(){
    Meteor.call("traders.assets.aggregate", [
      {
        $match: {pair: this.pair()}
      },
      {
        $group: {
          _id: "$position",
          count: {$sum: 1},
          traders: {$push: "$$ROOT"}
        }
      }
    ], (e, res)=>{
      console.log(e, res);
      this.tradersByPosition(res);
    });
  },
  renderTraders(){
    return <div></div>
  },
  render(){
    <div>
      <div b="repeat: tradersByPosition, key: _id">
      <div>
        <span style={{"fontSize": "40px"}}>{!repeatObject._id ? <img src="/chicken.jpg" style={{height: "60px"}}/> : repeatObject._id}</span> - {repeatObject.count}
      </div>

      <div className="row">
        {this.renderTraders(repeatObject)}
      </div>
      </div>
    </div>
  }
})
