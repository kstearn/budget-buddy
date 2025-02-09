import { useEffect } from 'react';
import './App.css';
import Nav from './components/Nav';
import { Outlet } from 'react-router-dom';
import { auth } from './firebase';

function App() {
  useEffect(() => {
    // sign out user upon window unload
    const handleBeforeUnload = async (event) => {
      await auth.signOut();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className="Layout">
      <Nav />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
