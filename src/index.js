import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom'
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

ReactDOM.render(
    <HashRouter>
        <MuiThemeProvider>
            <App/>
        </MuiThemeProvider>
    </HashRouter>,
    document.getElementById('root')
);
registerServiceWorker();
