import moment from "moment";

Idea({
  created(){
    console.log(this.props.idea);
  },
  formatDate(date){
    return moment(date).format("MM/DD/YYYY");
  },
  render(){

    <div class="card" >
      <img class="card-img-top" style={{height: "200px"}} src={this.props.idea.thumb} alt="Card image cap"/>
      <div class="card-body">
        <h5 class="card-title">{this.props.idea.title}</h5>
        <p class="card-text">
          {this.props.idea.username}
          {this.formatDate(this.props.idea.date)}
        </p>
        <a href={`https://tradingview.com${this.props.idea.widget_data.published_chart_url}`} class="btn btn-primary">view</a>
      </div>
    </div>
  }
});
