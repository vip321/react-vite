import React from "react";
import { HashRouter, Route, Switch, Link } from "react-router-dom";
import Home from "../pages/todoList";
const routerList = [
  {
    name: "首页",
    path: "/home",
    component: Home,
  },
];
const BasicRoute = () => (
  <HashRouter>
    <ul style={{ display: "flex", flexWrap: "wrap", padding: "0 0 20px 0" }}>
      {routerList.map((item, index) => {
        return (
          <li style={{ padding: "4px 10px" }} key={index}>
            <Link to={item.path} replace={false}>
              {item.name}
            </Link>
          </li>
        );
      })}
    </ul>
    <Switch>
      {routerList.map((item) => (
        <Route
          key={item.path}
          exact
          path={item.path}
          component={item.component}
        />
      ))}
    </Switch>
  </HashRouter>
);
export default BasicRoute;
