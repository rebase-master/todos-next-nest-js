'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navigation } from '../components/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { todosApi } from '../lib/api';
import { Todo, TodoStatus } from './../types';
import { useAuth } from '../lib/auth-context';
import { 
  Plus, 
  Edit, 
  Trash2, 
  User, 
  Clock, 
  CheckCircle2, 
  Circle, 
  PlayCircle,
  AlertCircle,
  BarChart3,
  TrendingUp
} from 'lucide-react';

type TabType = 'all' | 'pending' | 'in_progress' | 'completed';

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    async function fetchTodos() {
      try {
        const data = await todosApi.getAllTodos();
        setTodos(data);
      } catch (error) {
        console.error('Failed to fetch todos:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTodos();
  }, []);

  const filteredTodos = todos.filter(todo => {
    if (activeTab === 'all') return true;
    return todo.status === activeTab;
  });

  function getStatusIcon(status: string) {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <PlayCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-orange-100 text-orange-800 border-orange-200';
    }
  }

  function formatStatus(status: string) {
    return status.replace('_', ' ').toUpperCase();
  }

  function getTabCount(status: TabType) {
    if (status === 'all') return todos.length;
    return todos.filter(todo => todo.status === status).length;
  }

  const isOwner = (todo: Todo) => {
    return isAuthenticated && user && user.id === todo.user.id;
  };

  const getCompletionRate = () => {
    if (todos.length === 0) return 0;
    const completed = todos.filter(todo => todo.status === 'completed').length;
    return Math.round((completed / todos.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation />
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <BarChart3 className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Task Manager
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Organize, prioritize, and collaborate on tasks with ease. Track your progress and achieve your goals.
            </p>
            
            {/* Stats Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">{todos.length}</div>
                <div className="text-white/80 text-sm">Total Tasks</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">{getTabCount('completed')}</div>
                <div className="text-white/80 text-sm">Completed</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">{getTabCount('in_progress')}</div>
                <div className="text-white/80 text-sm">In Progress</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">{getCompletionRate()}%</div>
                <div className="text-white/80 text-sm">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow-lg border-b sticky top-16 z-10">
        <div className="container mx-auto px-4">
          <div className="flex space-x-0 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-4 font-semibold text-sm whitespace-nowrap border-b-3 transition-all duration-200 ${
                activeTab === 'all'
                  ? 'text-indigo-600 border-indigo-600 bg-indigo-50'
                  : 'text-gray-600 border-transparent hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              All Tasks ({getTabCount('all')})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-4 font-semibold text-sm whitespace-nowrap border-b-3 transition-all duration-200 ${
                activeTab === 'pending'
                  ? 'text-orange-600 border-orange-600 bg-orange-50'
                  : 'text-gray-600 border-transparent hover:text-orange-600 hover:bg-gray-50'
              }`}
            >
              Pending ({getTabCount('pending')})
            </button>
            <button
              onClick={() => setActiveTab('in_progress')}
              className={`px-6 py-4 font-semibold text-sm whitespace-nowrap border-b-3 transition-all duration-200 ${
                activeTab === 'in_progress'
                  ? 'text-blue-600 border-blue-600 bg-blue-50'
                  : 'text-gray-600 border-transparent hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              In Progress ({getTabCount('in_progress')})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-6 py-4 font-semibold text-sm whitespace-nowrap border-b-3 transition-all duration-200 ${
                activeTab === 'completed'
                  ? 'text-green-600 border-green-600 bg-green-50'
                  : 'text-gray-600 border-transparent hover:text-green-600 hover:bg-gray-50'
              }`}
            >
              Completed ({getTabCount('completed')})
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {activeTab === 'all' ? 'All Tasks' : 
               activeTab === 'pending' ? 'Pending Tasks' :
               activeTab === 'in_progress' ? 'In Progress Tasks' : 'Completed Tasks'}
            </h2>
            <p className="text-gray-600">
              {filteredTodos.length} {filteredTodos.length === 1 ? 'task' : 'tasks'} 
              {activeTab !== 'all' && ` in ${activeTab.replace('_', ' ')} status`}
            </p>
          </div>
          
          {isAuthenticated && (
            <Link href="/todos">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold">
                <Plus className="w-5 h-5 mr-2" />
                Create New Task
              </Button>
            </Link>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mb-6"></div>
            <p className="text-gray-600 text-lg">Loading your tasks...</p>
          </div>
        ) : filteredTodos.length === 0 ? (
          <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
            <CardContent className="text-center py-20">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {activeTab === 'all' ? 'No tasks yet' : `No ${activeTab.replace('_', ' ')} tasks`}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {activeTab === 'all' 
                  ? 'Get started by creating your first task and stay organized!' 
                  : `No tasks are currently in ${activeTab.replace('_', ' ')} status.`}
              </p>
              {!isAuthenticated && (
                <div className="space-y-4">
                  <Link href="/signup">
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold">
                      Get Started - Sign Up Free
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredTodos.map((todo, index) => (
              <Card 
                key={todo.id} 
                className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-2xl overflow-hidden group animate-fade-in" 
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-3">
                        {getStatusIcon(todo.status)}
                        <h3 className="text-xl font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                          {todo.name}
                        </h3>
                        <Badge className={`${getStatusColor(todo.status)} font-semibold px-3 py-1 rounded-full border`}>
                          {formatStatus(todo.status)}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-700 mb-4 leading-relaxed line-clamp-2">
                        {todo.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-medium text-gray-700">{todo.user.username}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(todo.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        {/* Progress indicator */}
                        <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          ID: #{todo.id}
                        </div>
                      </div>
                    </div>
                    
                    {/* Edit/Delete buttons - only for task owner */}
                    {isOwner(todo) && (
                      <div className="flex items-center space-x-2 ml-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Performance Insights */}
        {todos.length > 0 && (
          <Card className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">Your Progress</h3>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{getCompletionRate()}%</div>
                  <div className="text-indigo-200 text-sm">Completion Rate</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl font-bold">{getTabCount('pending')}</div>
                  <div className="text-indigo-200">Pending Tasks</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl font-bold">{getTabCount('in_progress')}</div>
                  <div className="text-indigo-200">In Progress</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl font-bold">{getTabCount('completed')}</div>
                  <div className="text-indigo-200">Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bottom CTA */}
        {!isAuthenticated && filteredTodos.length > 0 && (
          <Card className="mt-12 bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0 rounded-2xl overflow-hidden">
            <CardContent className="text-center py-16">
              <h3 className="text-3xl font-bold mb-4">Ready to boost your productivity?</h3>
              <p className="text-xl mb-8 text-emerald-100 max-w-2xl mx-auto">
                Join thousands of users who are already managing their tasks more efficiently
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold px-8 py-4 rounded-xl shadow-lg">
                    Start Free Today
                  </Button>
                </Link>
                <Link href="/signin">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600 font-bold px-8 py-4 rounded-xl">
                    Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
