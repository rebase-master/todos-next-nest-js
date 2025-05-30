'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { LogOut, User, CheckSquare, Home } from 'lucide-react';

export function Navigation() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
              Todo App
            </span>
          </Link>
          
          {/* Navigation Items */}
          <div className="flex items-center space-x-2">
            {/* Navigation Links */}
            <Link href="/" className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Home</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link href="/todos" className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200">
                  <CheckSquare className="w-4 h-4" />
                  <span className="hidden sm:inline font-medium">My Todos</span>
                </Link>
                
                {/* User Menu */}
                <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
                  <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-green-50 to-green-100 border border-green-200">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-sm font-medium text-gray-800">
                        {user?.username}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={logout}
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2 ml-4">
                <Link href="/signin">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 