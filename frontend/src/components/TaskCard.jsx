import React from 'react';
import { EditIcon, DeleteIcon } from './icons.jsx'; // Explicitly setting .jsx for consistent resolution

const TaskCard = ({ task, onEdit, onDelete }) => {
    // === Defensive check for undefined task object ===
    if (!task) {
        console.warn("TaskCard received an undefined task object and will not render.");
        return null;
    }
    // =========================================================

    // Function to format the date
    const formatDate = (dateString) => {
        // If the date is null or an empty string, display a placeholder
        if (!dateString || dateString === 'N/A' || dateString === '') return 'No Due Date';
        try {
            // Attempt to format YYYY-MM-DD date string
            // We use UTC conversion to prevent off-by-one-day errors when converting to local time
            const date = new Date(dateString + 'T00:00:00'); 
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch (e) {
            return dateString; // Return raw string if formatting fails
        }
    };

    return (
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-teal-500 transition-all duration-300 shadow-lg hover:shadow-teal-500/10 transform hover:-translate-y-1">
            <h3 className="font-bold text-md text-slate-200 mb-2">{task.title}</h3>
            <p className="text-slate-400 text-sm mb-4">{task.description}</p>
            <div className="flex justify-between items-center border-t border-slate-700 pt-3">
                {/* Displaying the formatted due date */}
                <span className="text-xs text-slate-500">Due: {formatDate(task.dueDate)}</span> 
                <div className="flex gap-2">
                    <button onClick={onEdit} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"><EditIcon /></button>
                    <button onClick={onDelete} className="p-1.5 text-red-500 hover:text-white hover:bg-red-500/50 rounded-md transition-colors"><DeleteIcon /></button>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
// import React from 'react';
// import { EditIcon, DeleteIcon } from './icons'; // FIX: Using standard import (no extension)

// const TaskCard = ({ task, onEdit, onDelete }) => {
//     // === Defensive check for undefined task object ===
//     if (!task) {
//         console.warn("TaskCard received an undefined task object and will not render.");
//         return null;
//     }
//     // =========================================================

//     return (
//         <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-teal-500 transition-all duration-300 shadow-lg hover:shadow-teal-500/10 transform hover:-translate-y-1">
//             <h3 className="font-bold text-md text-slate-200 mb-2">{task.title}</h3>
//             <p className="text-slate-400 text-sm mb-4">{task.description}</p>
//             <div className="flex justify-between items-center border-t border-slate-700 pt-3">
//                 <span className="text-xs text-slate-500">Due: {task.dueDate}</span>
//                 <div className="flex gap-2">
//                     <button onClick={onEdit} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"><EditIcon /></button>
//                     <button onClick={onDelete} className="p-1.5 text-red-500 hover:text-white hover:bg-red-500/50 rounded-md transition-colors"><DeleteIcon /></button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TaskCard;