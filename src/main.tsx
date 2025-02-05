import * as ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.tsx'
import { store } from './store.ts';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
  <App />
</Provider>
);