import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import { ThemeProvider } from '@emotion/react';
import { lightTheme, darkTheme } from './theme.ts';
import App from './App.tsx';
import { Provider } from 'react-redux';
import appStore, { persistor } from './redux/store/appStore.ts';
import { PersistGate } from 'redux-persist/integration/react';



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={appStore}>
      <PersistGate persistor={persistor}>
        <ThemeProvider theme={lightTheme}>         
          <App />        
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
