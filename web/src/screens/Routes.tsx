import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import { Calendar } from './Calendar';
import { isServer } from '../lib/isServer';

/**
 * For Routing
 */
const Routes = () => {
  return isServer ? null : (
    <Router basename="/dashboard">
      <Link to="/">Calendar</Link>
      <Link to="/test">test</Link>
      <Switch>
        <Route path="/" exact render={renderBasePath} />
        <Route path="/test" exact component={Test} />
      </Switch>
    </Router>
  );
};

export default Routes;

function Test() {
  return <div>Test component</div>;
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
