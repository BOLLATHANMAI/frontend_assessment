import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    // Filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Fetch user profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/user/profile');
                setUser(response.data.user);
            } catch (err) {
                console.error('Failed to fetch profile:', err);
                if (err.response?.status === 401) {
                    handleLogout();
                }
            }
        };
        fetchProfile();
    }, []);

    // Fetch tasks
    useEffect(() => {
        fetchTasks();
    }, [searchQuery, statusFilter]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);
            if (statusFilter !== 'all') params.append('status', statusFilter);

            const response = await api.get(`/tasks?${params.toString()}`);
            setTasks(response.data.tasks);
            setError('');
        } catch (err) {
            setError('Failed to fetch tasks');
            console.error('Fetch tasks error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleCreateTask = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleSaveTask = async (formData, taskId) => {
        try {
            if (taskId) {
                await api.put(`/tasks/${taskId}`, formData);
            } else {
                await api.post('/tasks', formData);
            }
            fetchTasks();
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Failed to save task');
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        try {
            await api.delete(`/tasks/${taskId}`);
            setTasks(tasks.filter(t => t.id !== taskId));
        } catch (err) {
            console.error('Delete task error:', err);
            setError('Failed to delete task');
        }
    };

    const handleToggleStatus = async (taskId, newStatus) => {
        try {
            await api.put(`/tasks/${taskId}`, { status: newStatus });
            setTasks(tasks.map(t =>
                t.id === taskId ? { ...t, status: newStatus } : t
            ));
        } catch (err) {
            console.error('Toggle status error:', err);
            setError('Failed to update task status');
        }
    };

    // Calculate stats
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50/20">
            {/* Decorative Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 -left-40 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-primary-300/10 rounded-full blur-3xl"></div>
            </div>

            {/* Header */}
            <header className="relative z-40 bg-white/70 backdrop-blur-xl border-b border-dark-200/50 sticky top-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 rounded-2xl flex items-center justify-center shadow-glow transform hover:scale-105 transition-transform duration-300">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold gradient-text">TaskFlow</h1>
                                <p className="text-dark-500 text-sm hidden sm:block">Manage your tasks efficiently</p>
                            </div>
                        </div>

                        {/* User Info & Logout */}
                        <div className="flex items-center gap-4">
                            {user && (
                                <div className="hidden sm:flex items-center gap-4 bg-dark-50 rounded-2xl px-4 py-2.5">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold shadow-soft">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-semibold text-dark-800">{user.name}</p>
                                        <p className="text-dark-500 text-xs">{user.email}</p>
                                    </div>
                                </div>
                            )}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-5 py-2.5 text-dark-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-10 animate-fade-in-down">
                    <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 mb-2">
                        Welcome back{user ? `, ${user.name.split(' ')[0]}` : ''}! 👋
                    </h2>
                    <p className="text-dark-500 text-lg">
                        {pendingTasks === 0
                            ? "You're all caught up! Time to add new tasks."
                            : `You have ${pendingTasks} task${pendingTasks > 1 ? 's' : ''} pending. Let's get things done!`
                        }
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                    <div className="stats-card bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-soft-xl animate-fade-in-up">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-primary-100 text-sm font-medium">Total Tasks</p>
                                <p className="text-4xl font-bold mt-2">{totalTasks}</p>
                            </div>
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="stats-card bg-gradient-to-br from-warning-500 to-orange-500 text-white shadow-soft-xl animate-fade-in-up animation-delay-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-100 text-sm font-medium">Pending</p>
                                <p className="text-4xl font-bold mt-2">{pendingTasks}</p>
                            </div>
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="stats-card bg-gradient-to-br from-success-500 to-emerald-500 text-white shadow-soft-xl animate-fade-in-up animation-delay-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Completed</p>
                                <p className="text-4xl font-bold mt-2">{completedTasks}</p>
                            </div>
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="stats-card bg-gradient-to-br from-accent-500 to-pink-500 text-white shadow-soft-xl animate-fade-in-up animation-delay-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-pink-100 text-sm font-medium">Completion Rate</p>
                                <p className="text-4xl font-bold mt-2">{completionRate}%</p>
                            </div>
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                        </div>
                        {/* Progress Ring */}
                        <div className="mt-4 w-full bg-white/20 rounded-full h-2 overflow-hidden">
                            <div
                                className="h-full bg-white rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${completionRate}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="glass-card mb-8 animate-fade-in-up animation-delay-400 !p-5">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1 group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-dark-400 group-focus-within:text-primary-500 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search tasks..."
                                className="input-field pl-12 !py-3.5"
                            />
                        </div>

                        {/* Filter */}
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="input-field !py-3.5 lg:w-48 cursor-pointer appearance-none pr-12"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">🕐 Pending</option>
                                <option value="completed">✅ Completed</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-dark-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Add Task Button */}
                        <button
                            onClick={handleCreateTask}
                            className="btn-primary flex items-center justify-center gap-2.5 !py-3.5 lg:w-auto"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>New Task</span>
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 flex items-center gap-3 animate-slide-down">
                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                {/* Task List */}
                <div className="space-y-4">
                    {loading ? (
                        // Loading Skeleton
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="card !p-6 animate-pulse">
                                    <div className="flex items-start gap-4">
                                        <div className="skeleton w-6 h-6 rounded-full"></div>
                                        <div className="flex-1 space-y-3">
                                            <div className="skeleton h-5 w-2/3 rounded-lg"></div>
                                            <div className="skeleton h-4 w-1/2 rounded-lg"></div>
                                            <div className="flex gap-3">
                                                <div className="skeleton h-6 w-20 rounded-full"></div>
                                                <div className="skeleton h-6 w-24 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : tasks.length === 0 ? (
                        // Empty State
                        <div className="text-center py-16 animate-fade-in-up">
                            <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 rounded-3xl mb-6">
                                <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-dark-900 mb-2">
                                {searchQuery || statusFilter !== 'all'
                                    ? 'No matching tasks'
                                    : 'No tasks yet'}
                            </h3>
                            <p className="text-dark-500 mb-6 max-w-sm mx-auto">
                                {searchQuery || statusFilter !== 'all'
                                    ? 'Try adjusting your search or filter criteria'
                                    : 'Create your first task and start being productive!'}
                            </p>
                            {!searchQuery && statusFilter === 'all' && (
                                <button
                                    onClick={handleCreateTask}
                                    className="btn-primary inline-flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Create First Task
                                </button>
                            )}
                        </div>
                    ) : (
                        tasks.map((task, index) => (
                            <div
                                key={task.id}
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <TaskCard
                                    task={task}
                                    onEdit={handleEditTask}
                                    onDelete={handleDeleteTask}
                                    onToggleStatus={handleToggleStatus}
                                />
                            </div>
                        ))
                    )}
                </div>
            </main>

            {/* Task Modal */}
            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTask}
                task={editingTask}
            />
        </div>
    );
}

export default Dashboard;
