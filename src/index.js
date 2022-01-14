import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import init from './init';

init()
  .then(({iweFetcher, envs}) => {
    ReactDOM.render(
      <React.StrictMode>
        <App 
          envs={envs}
          iweFetcher={iweFetcher}
        >
        </App>
      </React.StrictMode>,
      document.getElementById('root')
    );
  })



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
