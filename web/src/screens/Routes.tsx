import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { Calendar } from './Calendar';
import { isServer } from '../lib/isServer';
import { AppDefaultLayoutDesktop } from '@components/Layout/AppDefaultLayoutDesktop';
import { NavigationSideBar } from '@components/NavigationSideBar';

/**
 * For Routing
 */
const Routes = () => {
  return isServer ? null : (
    <Router basename="/dashboard">
      <Switch>
        <Route path="/" exact render={renderBasePath} />
        <Route path="/test" exact component={Test} />
      </Switch>
    </Router>
  );
};

export default Routes;

function Test() {
  return (
    <AppDefaultLayoutDesktop>
      <NavigationSideBar />
      Test Page
    </AppDefaultLayoutDesktop>
  );
}

function renderBasePath() {
  const key = '@d_path';
  const path = localStorage.getItem(key);

  if (path) {
    localStorage.setItem(key, '');
    return <Redirect to={{ pathname: path }} />;
  }
  return <Calendar />;
}
