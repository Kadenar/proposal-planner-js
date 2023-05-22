import "./components/Pages/page-styles.css";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { applyMiddleware, createStore } from "redux";

import Home from "./components/Pages/Home";
import Jobs from "./components/Pages/JobVisualizer";
import Navbar from "./components/coreui/Sidebar/Navbar";
import Proposals from "./components/Pages/Proposals";
import Clients from "./components/Pages/Clients";
import { Provider } from "react-redux";
import rootReducer from "./reducers/rootReducers";
import thunk from "redux-thunk";

// PAGES

import Products from "./components/Pages/Products";

export default function ProposalPlanner() {
  // Create our redux store to manage the state of our application when pricing out a job
  const store = createStore(rootReducer, applyMiddleware(thunk));
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

  // TODO - Remove this when done - only temporary to log the state when it changes
  store.subscribe(() => console.log(store.getState()));
  //console.log(store.getState());
  // Return our tabs
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes classname="routesContent">
          <Route path="/" exact element={<Home />} />
          <Route path="/clients" exact element={<Clients />}/>
          <Route path="/proposals" exact element={<Proposals />} />
          <Route path="/jobs" exact element={<Jobs />} />
          <Route path="/products" exact element={<Products />} />
        </Routes>
      </Router>
    </Provider>
  );
}
