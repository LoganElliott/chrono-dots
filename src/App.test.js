import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
      <HashRouter>
          <MuiThemeProvider>
          <App/>
        </MuiThemeProvider>
      </HashRouter>,
    div);
});
