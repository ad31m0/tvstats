import {GridTable} from "/imports/GridTable/GridTable";
import {TradersCollection} from "/imports/Traders/Traders";
TradersGrid({

  options(){
  return {
    search: true,
    addRowPosition: "first",
    paging: true,
    pageSize: 5,
    // actionsColumnIndex: -1,
    rowStyle: rowData => {
      return ({

    })
  }
  }
},
query(){
  return {};
},
columns(){
  return [
     {name: "avatar", label: "Avatar",
     options: {
       customBodyRender: (value, tableMeta, updateValue) => {
         return <img src={value} style={{height: "20px"}}/>;
       }
     }
   },

     {name: "username", label: "Username"},
     {name: "success", label: "Success"},
     {name: "ratio", label: "Ratio"},
     {name: "win", label: "Wins"},
     {name: "loss", label: "Loss"},



    ];
},

render(){

  return(

    <GridTable  actions={[]} creatable={true} editable={true} rows={this.rows()} collection={TradersCollection} title="Traders" sub="traders" optionsz={this.options()} query={this.query()} columns={this.columns()}/>
    );
}
})
