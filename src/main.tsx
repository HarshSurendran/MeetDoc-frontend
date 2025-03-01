import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import appStore, { persistor } from './redux/store/appStore.ts';
import { PersistGate } from 'redux-persist/integration/react';



createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Provider store={appStore}>
      <PersistGate persistor={persistor}>
          <App />        
      </PersistGate>
    </Provider>
  // </StrictMode>
);
