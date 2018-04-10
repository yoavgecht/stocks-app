import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import reducer from './store/reducer';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

// const store = createStore(reducer);

ReactDOM.render(<Provider /* store={store} */ ><App /></Provider>, document.getElementById('root'));
registerServiceWorker();