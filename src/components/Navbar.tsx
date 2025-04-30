
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { CarFront } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();

  return (
    <nav className="bg-valet-blue text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <CarFront className="h-6 w-6" />
            <span className="text-xl font-bold">Park-It Smart</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' || user?.role === 'attendant' ? (
                  <div className="flex space-x-4">
                    <Link to="/admin">
                      <Button variant={location.pathname.includes('/admin') ? "secondary" : "ghost"}>
                        Dashboard
                      </Button>
                    </Link>
                  </div>
                ) : null}
                
                <span className="text-sm hidden md:inline">Welcome, {user?.name}</span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link to="/retrieve">
                  <Button variant="outline" size="sm">
                    Retrieve Vehicle
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="sm">
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
