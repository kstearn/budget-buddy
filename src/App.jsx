import './App.css';
import Nav from './components/Nav';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="Layout">
        <Nav />
        <main>
          <Outlet />
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
