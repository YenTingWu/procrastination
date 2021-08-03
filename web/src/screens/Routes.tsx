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
import { Analysis } from '@screens/Analysis';

function renderBasePath() {
  const key = '@d_path';
  const path = localStorage.getItem(key);

  if (path) {
    localStorage.setItem(key, '');
    return <Redirect to={{ pathname: path }} />;
  }
  return <Todo />;
}

/**
 * For Routing
 */
const Routes = () => {
  return isServer ? null : (
    <Router basename="/dashboard">
      <Switch>
        <Route path="/" exact render={renderBasePath} />
        <Route path="/calendar" exact component={Calendar} />
        <Route path="/profile" exact component={Profile} />
        <Route path="/analysis" component={Analysis} />
      </Switch>
    </Router>
  );
};

export default Routes;
