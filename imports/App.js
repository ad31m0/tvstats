

import {CandlesCollection} from "/imports/Candles/Candles";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import {TraderProfile} from "/imports/Traders/TraderProfile/TraderProfile";

App({
  created(){


  },
  getData() {
    let data = CandlesCollection.find({}, {sort: {date: 1}}).fetch();
    return data.sort((a, b) => {
      if(a.time < b.time) return -1;
      else return 1;
    });
  },
  render() {
    <div className="container-fluid">

    <Router>
     <div>
      <Navbar/>

       <Switch>

         <Route path="/traders">
         <TraderAssets />


         </Route>
         <Route path="/ideas">
           <Ideas />
         </Route>

         <Route path="/trader/:id" render={(props) =>{
           return <TraderProfile {...props} />
         }} >
        </Route>

         <Route path="/">
         <div className="row">
           <div className="col-md-12">

           <IdeasByPositionChart/>


           </div>
           <div className="col-md-12">
           <TraderAssets />

          </div>
          </div>


         </Route>
       </Switch>
     </div>
   </Router>



    </div>
  }
})
