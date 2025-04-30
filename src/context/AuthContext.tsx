
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { mockUsers } from '../data/mockData';
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  role: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  role: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('parkitUser');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  // Setup event listeners for user activity
  useEffect(() => {
    if (!isAuthenticated) return;

    const updateActivity = () => {
      setLastActivity(Date.now());
    };

    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity);
    });

    // Check for inactivity
    const intervalId = setInterval(() => {
      const currentTime = Date.now();
      if (currentTime - lastActivity > INACTIVITY_TIMEOUT) {
        logout();
        toast({
          title: "Session expired",
          description: "You have been logged out due to inactivity",
        });
      }
    }, 30000); // Check every 30 seconds

    return () => {
      // Clean up event listeners and interval
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
      clearInterval(intervalId);
    };
  }, [isAuthenticated, lastActivity]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // This is a mock login - in a real app, you would validate against a backend
    if (password === 'password') { // Mock password for demo
      const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser) {
        setUser(foundUser);
        setIsAuthenticated(true);
        setLastActivity(Date.now()); // Reset activity timer on login
        // Store user in localStorage
        localStorage.setItem('parkitUser', JSON.stringify(foundUser));
        toast({
          title: "Logged in successfully",
          description: `Welcome back, ${foundUser.name}!`,
        });
        return true;
      }
    }
    
    toast({
      title: "Login failed",
      description: "Invalid email or password",
      variant: "destructive",
    });
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('parkitUser');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout,
      role: user?.role || null 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
