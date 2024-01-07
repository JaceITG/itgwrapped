import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import XmlParser from './components/xmlParser';
import stats from './assets/Stats.xml';
import App from './App.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
)
