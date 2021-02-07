import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import App from './App';
import { reducer, StateProvider } from "./state";

// semantic assets
const styleLink = document.createElement("link"); styleLink.rel = "stylesheet"; styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css"; document.head.appendChild(styleLink);

ReactDOM.render(
  <StateProvider reducer={reducer}>
    <App />
  </StateProvider>,
  document.getElementById('root')
);
