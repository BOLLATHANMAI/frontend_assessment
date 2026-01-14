import { useState, useEffect, useRef } from 'react';

function TaskModal({ isOpen, onClose, onSave, task }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const titleInputRef = useRef(null);

    const isEditing = Boolean(task);
    const maxDescriptionLength = 500;

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                status: task.status || 'pending'
            });
            setCharCount(task.description?.length || 0);
        } else {
            setFormData({
                title: '',
                description: '',
                status: 'pending'
            });
            setCharCount(0);
        }
        setError('');
    }, [task, isOpen]);

    useEffect(() => {
        if (isOpen && titleInputRef.current) {
            setTimeout(() => titleInputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'description') {
            if (value.length <= maxDescriptionLength) {
                setFormData(prev => ({ ...prev, [name]: value }));
                setCharCount(value.length);
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            setError('Task title is required');
            titleInputRef.current?.focus();
            return;
        }

        setLoading(true);
        try {
            await onSave(formData, task?.id);
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to save task');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-dark-900/60 backdrop-blur-md animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl animate-scale-in overflow-hidden">
                {/* Decorative Top Bar */}
                <div className="h-1.5 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500"></div>

                {/* Header */}
                <div className="flex items-center justify-between px-7 py-5 border-b border-dark-100">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isEditing
                            ? 'bg-primary-100 text-primary-600'
                            : 'bg-success-100 text-success-600'
                            }`}>
                            {isEditing ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                </svg>
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-dark-900">
                                {isEditing ? 'Edit Task' : 'Create New Task'}
                            </h2>
                            <p className="text-sm text-dark-500">
                                {isEditing ? 'Update your task details' : 'Add a new task to your list'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2.5 text-dark-400 hover:text-dark-600 hover:bg-dark-100 rounded-xl transition-all duration-200"
                        aria-label="Close modal"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-7 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 animate-slide-down">
                            <svg className="flex-shrink-0 w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className="text-red-600 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {/* Title Field */}
                    <div className="space-y-2">
                        <label className="flex items-center justify-between text-sm font-semibold text-dark-700">
                            <span>Task Title <span className="text-red-500">*</span></span>
                        </label>
                        <input
                            ref={titleInputRef}
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="What needs to be done?"
                            maxLength={100}
                        />
                    </div>

                    {/* Description Field */}
                    <div className="space-y-2">
                        <label className="flex items-center justify-between text-sm font-semibold text-dark-700">
                            <span>Description</span>
                            <span className={`text-xs font-normal ${charCount > maxDescriptionLength * 0.9
                                ? 'text-warning-600'
                                : 'text-dark-400'
                                }`}>
                                {charCount}/{maxDescriptionLength}
                            </span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="input-field resize-none"
                            placeholder="Add some details about this task..."
                        />
                    </div>

                    {/* Status Field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-dark-700">
                            Status
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, status: 'pending' }))}
                                className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl border-2 font-medium transition-all duration-200 ${formData.status === 'pending'
                                    ? 'border-warning-500 bg-warning-50 text-warning-700'
                                    : 'border-dark-200 bg-white text-dark-600 hover:border-dark-300'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Pending
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, status: 'completed' }))}
                                className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl border-2 font-medium transition-all duration-200 ${formData.status === 'completed'
                                    ? 'border-success-500 bg-success-50 text-success-700'
                                    : 'border-dark-200 bg-white text-dark-600 hover:border-dark-300'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Completed
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex-1 flex items-center justify-center gap-2.5"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    {isEditing ? (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Update Task</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                            </svg>
                                            <span>Create Task</span>
                                        </>
                                    )}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TaskModal;
