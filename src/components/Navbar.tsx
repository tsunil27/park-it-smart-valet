
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { CarFront, Home, LayoutDashboard, CheckIn, LogOut, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();

  return (
    <nav className="bg-[#1a237e] text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <CarFront className="h-6 w-6 text-yellow-400" />
            <span className="text-xl font-bold">ValetPro</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex space-x-2">
                  <Link to="/">
                    <Button variant="ghost" className="flex gap-2 items-center text-white">
                      <Home size={18} />
                      <span>Home</span>
                    </Button>
                  </Link>
                  
                  <Link to="/admin">
                    <Button 
                      variant="ghost" 
                      className={`flex gap-2 items-center text-white ${location.pathname.includes('/admin') ? 'bg-white/20' : ''}`}
                    >
                      <LayoutDashboard size={18} />
                      <span>Dashboard</span>
                    </Button>
                  </Link>
                  
                  <Button 
                    variant="ghost" 
                    className="flex gap-2 items-center text-white"
                    onClick={() => location.pathname === '/admin' && document.dispatchEvent(new CustomEvent('openCheckInDialog'))}
                  >
                    <CheckIn size={18} />
                    <span>Check In</span>
                  </Button>
                </div>
                
                <div className="flex items-center gap-3 border-l border-white/20 pl-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-600 rounded-full p-1">
                      <User size={16} />
                    </div>
                    <span className="text-sm hidden md:inline">{user?.name || 'Valet User'}</span>
                  </div>
                  
                  <Button variant="ghost" size="sm" onClick={logout} className="text-white">
                    <LogOut size={18} />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link to="/retrieve">
                  <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/10">
                    Retrieve Vehicle
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/10">
                    Staff Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
