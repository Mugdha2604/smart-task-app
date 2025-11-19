// src/components/TaskColumn.jsx

import React from 'react';
import TaskCard from './TaskCard';
import { statusConfig } from '../data/constants';

const TaskColumn = ({ status, tasks, onEdit, onDelete }) => {
    const { border, dot } = statusConfig[status];
    return (
        <div className={`flex-1 bg-slate-800/50 rounded-lg p-4 border-t-4 ${border}`}>
            <div className="flex items-center gap-3 mb-4">
                <span className={`h-3 w-3 rounded-full ${dot}`}></span>
                <h2 className="font-semibold text-slate-200">{status}</h2>
                <span className="bg-slate-700 text-slate-400 text-xs font-medium px-2 py-0.5 rounded-full">{tasks.length}</span>
            </div>
            <div className="space-y-4">
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <TaskCard key={task.id} task={task} onEdit={() => onEdit(task)} onDelete={() => onDelete(task)} />
                    ))
                ) : (
                    <div className="text-center py-8 px-4 border-2 border-dashed border-slate-700 rounded-lg">
                        <p className="text-slate-500">No tasks here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskColumn;