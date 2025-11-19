// src/components/DeleteConfirmationModal.jsx

import React from 'react';

const DeleteConfirmationModal = ({ onConfirm, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-sm border border-slate-700 p-6 animate-scale-in">
                <h2 className="text-xl font-bold text-slate-200">Are you sure?</h2>
                <p className="text-slate-400 mt-2">This action cannot be undone. You will permanently delete this task.</p>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-sm font-medium transition-colors">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium transition-colors">Delete</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;