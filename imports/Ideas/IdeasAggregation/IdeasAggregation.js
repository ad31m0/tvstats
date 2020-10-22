IdeasAggregation({
  render(){
    return (
      <div>

        <div>Ideas result: {this.props.data.length}</div>

            <div b="repeat: this.props.data, key: _id"  >


              <div className="">{repeatObject._id} {repeatObject.count}</div>

              <div className="">

              </div>
            </div>

        })}
      </div>
    );
  }
})
