
import React, {
 useState,
 useEffect,
 useRef,
 forwardRef,
} from 'react';

import MUIDataTable from "mui-datatables";

const data = [
 {username: "EXCAVO", _id: "ID"}
];

const options = {
  filterType: 'checkbox',
};


// import MaterialTable from "material-table";
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

GridTable({

message: null,
propz(){
  console.log("this",  this.data(), this.columns());
  return this.data();
},
tableRef: null,
created(){
  console.log("actions",this.actions)
  this.tableRef(React.createRef());
},
refreshTable(){
  let tableRef = this.tableRef();

  console.log("refreshing", tableRef, this.query());
  tableRef.current.onQueryChange();
},
render(){


  return (

      <div>


      <MUIDataTable
        title={"Traders "}
        data={this.rows()}
        columns={this.columns()}
        options={options}
      />
    <Snackbar open={this.message() ? true : false} autoHideDuration={3000}      anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={()=>{this.message(null)}} >
        <Alert severity={this.message() ? this.message().type : "success"}>
            {this.message() ? this.message().text : ""}
        </Alert>
      </Snackbar>
  </div>



  );
}
});
// <MaterialTable
//   style={{width: "100%"}}
//   tableRef={this.tableRef()}
//   title={this.title()}
//   columns={this.columns().array()}
//   onRowClick={this.onRowClick ? this.onRowClick : null}
//   editable={{
//     onRowAdd: !this.creatable ? null : newData =>{
//       Meteor.call("module.create", {newData, collection: this.sub()})
//     },
//     onRowUpdate: !this.editable ? null : (newData, oldData) =>{
//       Meteor.call("module.update", {newData, oldData, collection: this.sub()})
//
//     },
//     onRowDelete: oldData =>{
//       Meteor.call("module.delete", {oldData, collection: this.sub()})
//     }
// }}
// options = {this.optionsz()}
// data={options => this.collection().find(query, options).fetch()}
// />
