'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '../../components/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { todosApi } from '../../lib/api';
import { Todo, TodoStatus } from '../../types';
import { useAuth } from '../../lib/auth-context';
import { 
  Plus, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  PenTool, 
  FileText, 
  Activity,
  Target,
  TrendingUp,
  Calendar,
  User,
  Settings,
  Edit3,
  Trash2,
  Play,
  CheckSquare,
  Square,
  RotateCcw
} from 'lucide-react';

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: TodoStatus.PENDING,
  });
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | TodoStatus>('all');
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
      return;
    }

    async function fetchMyTodos() {
      try {
        const data = await todosApi.getMyTodos();
        setTodos(data);
      } catch (error) {
        console.error('Failed to fetch todos:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMyTodos();
  }, [isAuthenticated, router]);

  const filteredTodos = todos.filter(todo => 
    activeFilter === 'all' ? true : todo.status === activeFilter
  );

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError('');

    try {
      const newTodo = await todosApi.createTodo(formData);
      setTodos(prev => [newTodo, ...prev]);
      setFormData({
        name: '',
        description: '',
        status: TodoStatus.PENDING,
      });
      setShowForm(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error && 'response' in err && 
        typeof err.response === 'object' && err.response !== null &&
        'data' in err.response && typeof err.response.data === 'object' && 
        err.response.data !== null && 'message' in err.response.data
        ? String(err.response.data.message)
        : 'Failed to create todo';
      setError(errorMessage);
    } finally {
      setCreating(false);
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Play className="w-5 h-5 text-blue-600" />;
      default:
        return <Square className="w-5 h-5 text-orange-600" />;
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

  function getFilterCount(filter: 'all' | TodoStatus) {
    if (filter === 'all') return todos.length;
    return todos.filter(todo => todo.status === filter).length;
  }

  const getCompletionRate = () => {
    if (todos.length === 0) return 0;
    const completed = todos.filter(todo => todo.status === 'completed').length;
    return Math.round((completed / todos.length) * 100);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation />
      
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">My Dashboard</h1>
                  <p className="text-white/90">Welcome back, {user?.username}!</p>
                </div>
              </div>
              <p className="text-white/80 text-lg max-w-2xl">
                Manage your personal tasks, track progress, and stay productive.
              </p>
            </div>
            
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-200 px-6 py-3 rounded-xl font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Task
            </Button>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">{todos.length}</div>
              <div className="text-white/80 text-sm">Total Tasks</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">{getFilterCount(TodoStatus.PENDING)}</div>
              <div className="text-white/80 text-sm">Pending</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">{getFilterCount(TodoStatus.IN_PROGRESS)}</div>
              <div className="text-white/80 text-sm">In Progress</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">{getCompletionRate()}%</div>
              <div className="text-white/80 text-sm">Complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Task Form */}
      {showForm && (
        <div className="bg-white border-b shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <Card className="max-w-2xl mx-auto border-0 shadow-xl rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                      <PenTool className="w-6 h-6 mr-3 text-indigo-600" />
                      Create New Task
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-2">
                      Add a new task to your personal dashboard
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Task Title *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter task title..."
                      required
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your task in detail..."
                      rows={4}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-indigo-500 transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                      Initial Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                    >
                      <option value={TodoStatus.PENDING}>Pending</option>
                      <option value={TodoStatus.IN_PROGRESS}>In Progress</option>
                      <option value={TodoStatus.COMPLETED}>Completed</option>
                    </select>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={creating}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all duration-200"
                    >
                      {creating ? (
                        <>
                          <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <CheckSquare className="w-4 h-4 mr-2" />
                          Create Task
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white shadow-lg border-b sticky top-16 z-10">
        <div className="container mx-auto px-4">
          <div className="flex space-x-0 overflow-x-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-6 py-4 font-semibold text-sm whitespace-nowrap border-b-3 transition-all duration-200 ${
                activeFilter === 'all'
                  ? 'text-indigo-600 border-indigo-600 bg-indigo-50'
                  : 'text-gray-600 border-transparent hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              All Tasks ({getFilterCount('all')})
            </button>
            <button
              onClick={() => setActiveFilter(TodoStatus.PENDING)}
              className={`px-6 py-4 font-semibold text-sm whitespace-nowrap border-b-3 transition-all duration-200 ${
                activeFilter === TodoStatus.PENDING
                  ? 'text-orange-600 border-orange-600 bg-orange-50'
                  : 'text-gray-600 border-transparent hover:text-orange-600 hover:bg-gray-50'
              }`}
            >
              Pending ({getFilterCount(TodoStatus.PENDING)})
            </button>
            <button
              onClick={() => setActiveFilter(TodoStatus.IN_PROGRESS)}
              className={`px-6 py-4 font-semibold text-sm whitespace-nowrap border-b-3 transition-all duration-200 ${
                activeFilter === TodoStatus.IN_PROGRESS
                  ? 'text-blue-600 border-blue-600 bg-blue-50'
                  : 'text-gray-600 border-transparent hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              In Progress ({getFilterCount(TodoStatus.IN_PROGRESS)})
            </button>
            <button
              onClick={() => setActiveFilter(TodoStatus.COMPLETED)}
              className={`px-6 py-4 font-semibold text-sm whitespace-nowrap border-b-3 transition-all duration-200 ${
                activeFilter === TodoStatus.COMPLETED
                  ? 'text-green-600 border-green-600 bg-green-50'
                  : 'text-gray-600 border-transparent hover:text-green-600 hover:bg-gray-50'
              }`}
            >
              Completed ({getFilterCount(TodoStatus.COMPLETED)})
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Task List Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {activeFilter === 'all' ? 'All Tasks' : 
               `${formatStatus(activeFilter)} Tasks`}
            </h2>
            <p className="text-gray-600">
              {filteredTodos.length} {filteredTodos.length === 1 ? 'task' : 'tasks'}
              {activeFilter !== 'all' && ` in ${formatStatus(activeFilter).toLowerCase()} status`}
            </p>
          </div>
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
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {activeFilter === 'all' ? 'No tasks yet' : `No ${formatStatus(activeFilter).toLowerCase()} tasks`}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {activeFilter === 'all' 
                  ? 'Create your first task to get started with your productivity journey!' 
                  : `You don't have any tasks in ${formatStatus(activeFilter).toLowerCase()} status.`}
              </p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Task
              </Button>
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
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Created {new Date(todo.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(todo.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          ID: #{todo.id}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex items-center space-x-2 ml-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 rounded-lg"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Progress Summary */}
        {todos.length > 0 && (
          <Card className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">Your Progress Overview</h3>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{getCompletionRate()}%</div>
                  <div className="text-indigo-200 text-sm">Completion Rate</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl font-bold">{getFilterCount(TodoStatus.PENDING)}</div>
                  <div className="text-indigo-200">Pending Tasks</div>
                  <div className="text-xs text-indigo-100 mt-1">Need attention</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl font-bold">{getFilterCount(TodoStatus.IN_PROGRESS)}</div>
                  <div className="text-indigo-200">In Progress</div>
                  <div className="text-xs text-indigo-100 mt-1">Currently working</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl font-bold">{getFilterCount(TodoStatus.COMPLETED)}</div>
                  <div className="text-indigo-200">Completed</div>
                  <div className="text-xs text-indigo-100 mt-1">Successfully done</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
} 