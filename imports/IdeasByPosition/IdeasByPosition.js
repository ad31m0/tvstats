import {Idea} from "/imports/Ideas/Idea/Idea";

IdeasByPosition({
  share: ["query"],
  shortIdeasList: [],
  longIdeasList: [],
  fetchData(){
    let that = this;
    Meteor.call("ideas.aggregate", this.getPipeline("Short"), (res,er)=>{
      that.shortIdeasList(er);
    });
    Meteor.call("ideas.aggregate", this.getPipeline("Long"), (res,er)=>{
      that.longIdeasList(er);
    });
  },
  created(){
    this.fetchData();
  },
  autorun(){
    if(this.pair()){
      this.fetchData();
    }
  },
  getPipeline(position){
    return [
      {$match: {pair: this.pair(), position}},
      {$sort: {date: -1}},
      {$group: {
        _id: "$username",

        idea:  {$first: "$$ROOT"}
      }},

      {$limit: 100}
    ]
  },
  render(){
    return(
      <div className="row">
      <div className="col-md-6">
        <div b="repeat: longIdeasList, key: _id, value: repeatObject._id.username">
          <Idea idea={repeatObject.idea}/>
        </div>
      </div>
      <div className="col-md-6">
        <div b="repeat: shortIdeasList, key: _id, value: repeatObject._id.username">
        <Idea idea={repeatObject.idea}/>
        </div>
      </div>
      </div>
    )
  }
})
