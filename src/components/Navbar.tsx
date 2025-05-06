
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { CarFront, Home, LayoutDashboard, PlusCircle, LogOut, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user, role } = useAuth();
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
                {/* Admin and attendant links */}
                {(role === 'admin' || role === 'attendant') && (
                  <div className="flex space-x-2">
                    <Link to="/admin">
                      <Button 
                        variant={location.pathname === '/admin' ? "secondary" : "ghost"} 
                        size="sm"
                      >
                        <LayoutDashboard className="mr-1 h-4 w-4" />
                        <span className="hidden md:inline">Dashboard</span>
                      </Button>
                    </Link>
                    <Link to="/checkin">
                      <Button 
                        variant={location.pathname === '/checkin' ? "secondary" : "ghost"} 
                        size="sm"
                      >
                        <PlusCircle className="mr-1 h-4 w-4" />
                        <span className="hidden md:inline">Check In</span>
                      </Button>
                    </Link>
                  </div>
                )}
                
                {/* Customer links */}
                {role === 'customer' && (
                  <Link to="/customer">
                    <Button 
                      variant={location.pathname === '/customer' ? "secondary" : "ghost"} 
                      size="sm"
                    >
                      <User className="mr-1 h-4 w-4" />
                      <span className="hidden md:inline">My Vehicle</span>
                    </Button>
                  </Link>
                )}
                
                <span className="text-sm hidden md:inline">Welcome, {user?.name}</span>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="mr-1 h-4 w-4" />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link to="/">
                  <Button 
                    variant={location.pathname === '/' ? "secondary" : "ghost"}
                    size="sm"
                  >
                    <Home className="mr-1 h-4 w-4" />
                    <span>Home</span>
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    <User className="mr-1 h-4 w-4" />
                    <span>Login</span>
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
