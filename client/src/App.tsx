import { BrowserRouter, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function AppLayout() {
  const location = useLocation()
  const hideSidebarRoutes = ['/', '/register'] // daftar route yang tidak perlu sidebar
  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname)

  
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {!shouldHideSidebar && <Sidebar />}

      {/* Main Content */}
      <div className="flex-grow p-4 overflow-auto">
        <AppRoutes />
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout/>
    </BrowserRouter>
  );
}

export default App;
