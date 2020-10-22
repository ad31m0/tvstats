TraderRow({
  render(){
    <tr>
      <th><img src={this.props.avatar} style={{height: "20px"}}/></th>
      <th>{this.props.username}</th>
      <th>{this.props.positions}</th>
      <th>{this.props.win}</th>
      <th>{this.props.loss}</th>
      <th>{Math.round(this.props.success*10000)/100} %</th>
      <th>{Math.round(this.props.ratio*1000)/1000}</th>
    </tr>
  }
})
