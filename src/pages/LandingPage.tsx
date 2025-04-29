
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CarFront, Clock, Shield, MapPin } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (role === 'admin' || role === 'attendant') {
        navigate('/admin');
      } else {
        navigate('/customer');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-valet-blue to-blue-900 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-8 inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full">
            <CarFront size={32} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Park-It Smart Valet Service</h1>
          <p className="text-xl md:max-w-xl mx-auto mb-8">
            The modern solution for valet parking management. Streamlined check-in, real-time tracking, and effortless retrieval.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg" 
            className="bg-white text-valet-blue hover:bg-white/90"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-valet-blue rounded-full text-white mb-4">
                <CarFront size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Effortless Check-In</h3>
              <p className="text-gray-600">
                Our valets quickly register your vehicle and provide a digital ticket for easy retrieval.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-slate-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-valet-blue rounded-full text-white mb-4">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Tracking</h3>
              <p className="text-gray-600">
                Know exactly where your car is parked and its status at all times through our digital platform.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-slate-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-valet-blue rounded-full text-white mb-4">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">One-Click Retrieval</h3>
              <p className="text-gray-600">
                Request your vehicle with a single tap and get an accurate ETA for when it will be ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Designed for Your Convenience</h2>
              <p className="text-gray-600 mb-8">
                Our valet service uses the latest technology to provide you with a seamless parking experience.
                No more waiting in line or lost tickets - everything is digital, secure, and at your fingertips.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="mr-3 mt-1 text-valet-blue">
                    <Shield size={18} />
                  </div>
                  <span>Secure parking with constant monitoring</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 text-valet-blue">
                    <Shield size={18} />
                  </div>
                  <span>Digital tickets that can't be lost</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 text-valet-blue">
                    <Shield size={18} />
                  </div>
                  <span>Transparent pricing with no surprise fees</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="bg-valet-blue text-white p-4 rounded-t-lg">
                <h3 className="font-semibold">Customer Experience</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="border-b pb-4">
                  <p className="text-sm text-gray-500">1. Arrive at the venue</p>
                  <p className="font-medium">Hand your keys to our valet</p>
                </div>
                <div className="border-b pb-4">
                  <p className="text-sm text-gray-500">2. Receive digital ticket</p>
                  <p className="font-medium">Access your ticket on your phone</p>
                </div>
                <div className="border-b pb-4">
                  <p className="text-sm text-gray-500">3. Enjoy your time</p>
                  <p className="font-medium">No need to worry about your car</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">4. Request retrieval</p>
                  <p className="font-medium">Your car will be ready on time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-valet-blue text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to experience modern valet parking?</h2>
          <p className="mb-6">Sign in to manage your vehicle or contact our valet desk.</p>
          <Button 
            onClick={handleGetStarted}
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white hover:text-valet-blue"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Sign In'}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center items-center mb-4">
            <CarFront className="h-6 w-6 mr-2" />
            <span className="text-xl font-bold">Park-It Smart</span>
          </div>
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Park-It Smart Valet Service. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
