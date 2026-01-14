function TaskCard({ task, onEdit, onDelete, onToggleStatus }) {
    const isCompleted = task.status === 'completed';

    return (
        <div className={`group relative bg-white rounded-3xl border-2 p-6 
            transition-all duration-300 ease-out
            ${isCompleted
                ? 'border-success-200 bg-gradient-to-r from-success-50/50 to-white'
                : 'border-dark-100 hover:border-primary-200 hover:shadow-card-hover'
            }
            hover:-translate-y-1
        `}>
            {/* Priority Indicator Line */}
            <div className={`absolute left-0 top-6 bottom-6 w-1 rounded-full transition-all duration-300
                ${isCompleted ? 'bg-success-400' : 'bg-primary-400 group-hover:bg-primary-500'}
            `}></div>

            <div className="flex items-start gap-5 pl-3">
                {/* Status Toggle */}
                <button
                    onClick={() => onToggleStatus(task.id, isCompleted ? 'pending' : 'completed')}
                    className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center 
                        transition-all duration-300 transform hover:scale-110
                        ${isCompleted
                            ? 'bg-success-500 border-success-500 text-white shadow-sm'
                            : 'border-dark-300 hover:border-primary-500 hover:bg-primary-50'
                        }`}
                    aria-label={isCompleted ? 'Mark as pending' : 'Mark as completed'}
                >
                    <svg
                        className={`w-4 h-4 transition-all duration-300 ${isCompleted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                </button>

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-lg transition-all duration-300 ${isCompleted
                        ? 'line-through text-dark-400'
                        : 'text-dark-800 group-hover:text-dark-900'
                        }`}>
                        {task.title}
                    </h3>
                    {task.description && (
                        <p className={`mt-1.5 text-sm leading-relaxed transition-all duration-300 ${isCompleted ? 'text-dark-400' : 'text-dark-500'
                            }`}>
                            {task.description}
                        </p>
                    )}

                    {/* Meta Info */}
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                            transition-all duration-200
                            ${isCompleted
                                ? 'bg-success-100 text-success-700 ring-1 ring-success-200'
                                : 'bg-warning-100 text-warning-700 ring-1 ring-warning-200'
                            }`}>
                            {isCompleted ? (
                                <>
                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Completed
                                </>
                            ) : (
                                <>
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Pending
                                </>
                            )}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs text-dark-400 font-medium">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(task.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <button
                        onClick={() => onEdit(task)}
                        className="p-2.5 text-dark-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200 transform hover:scale-110"
                        title="Edit task"
                        aria-label="Edit task"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => onDelete(task.id)}
                        className="p-2.5 text-dark-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 transform hover:scale-110"
                        title="Delete task"
                        aria-label="Delete task"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TaskCard;
