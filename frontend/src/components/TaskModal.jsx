import React from 'react';

// NOTE: setFeedback prop has been removed as toastify is used directly in KanbanBoard
const TaskModal = ({ mode, task, onSave, onClose }) => {
    const [formData, setFormData] = React.useState({
        id: task?.id || null,
        title: task?.title || '',
        description: task?.description || '',
        status: task?.status || 'To Do',
        dueDate: task?.dueDate || '', 
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-lg border border-slate-700 animate-scale-in">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-6 text-slate-200">{mode === 'add' ? 'Add a New Task' : 'Edit Task'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-slate-400 mb-1">Title</label>
                            <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="4" required className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"></textarea>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="dueDate" className="block text-sm font-medium text-slate-400 mb-1">Due Date</label>
                                {/* Removed 'required' attribute */}
                                <input type="date" name="dueDate" id="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" />
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-slate-400 mb-1">Status</label>
                                <select name="status" id="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all">
                                    <option>To Do</option>
                                    <option>In Progress</option>
                                    <option>Done</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-sm font-medium transition-colors">Cancel</button>
                            <button type="submit" className="px-6 py-2 bg-teal-500 hover:bg-teal-600 rounded-md text-sm font-medium transition-colors">Save Task</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;