import React from "react";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";

import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";

const RouterPage = () => {
  return (
    <HashRouter>
      <Switch>
        <Route path={"/login"} component={LoginPage} />
        <Route path="/" render={() => (
            <HomePage>
              <Switch>
                <Redirect to="/home" />
              </Switch>
            </HomePage>
          )}
        />
      </Switch>
    </HashRouter>
  );
};
export default RouterPage;
