import ReactDOM from 'react-dom/client';
import RouterGurad from '@/router/RouterGurad';
import { BrowserRouter } from 'react-router-dom';
import './index.css';

const App = () => {
  return <RouterGurad />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
