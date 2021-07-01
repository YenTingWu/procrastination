import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { isServer } from '@lib/isServer';
import { Calendar } from '@screens/Calendar';
import { Todo } from '@screens/Todo';
import { Profile } from '@screens/Profile';

function renderBasePath() {
  const key = '@d_path';
  const path = localStorage.getItem(key);

  if (path) {
    localStorage.setItem(key, '');
    return <Redirect to={{ pathname: path }} />;
  }
  return <Calendar />;
}

/**
 * For Routing
 */
const Routes = () => {
  return isServer ? null : (
    <Router basename="/dashboard">
      <Switch>
        <Route path="/" exact render={renderBasePath} />
        <Route path="/todo" exact component={Todo} />
        <Route path="/profile" exact component={Profile} />
      </Switch>
    </Router>
  );
};

export default Routes;
