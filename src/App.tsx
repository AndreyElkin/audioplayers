import { useEffect } from 'react';
import { AppRouter } from './core/AppRouter';
import { appController } from './core/AppController';
import './styles/globals.scss';

function App() {
  useEffect(() => {
    appController.initialize();
  }, []);

  return <AppRouter />;
}

export default App;
