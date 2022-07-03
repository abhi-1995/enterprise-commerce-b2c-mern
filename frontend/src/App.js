import './App.css';
import Header from "./component/layout/Header/Header";
import Footer from "./component/layout/Footer/Footer.js"
import React from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import WebFont from "webfontloader";
import Home from "./component/Home/Home.js";
import ProductDetails from "./component/Product/ProductDetails.js";


function App() {
    React.useEffect(() => {
        WebFont.load({
            google:{
                families:["Roboto","Drold Sans","Chilanka"]
            }
        })
    },[]);
  return (
      <Router>
          <Header />
          <Route exact path="/" component={Home} />
          <Route exact path="/product/:id" component={ProductDetails} />
          <Footer />
      </Router>
  );
}

export default App;
