import React, { useState, useMemo, useEffect } from 'react';
import { STATUSES } from '../data/constants.js'; // FIX: Consistent .js extension
import * as taskService from '../services/taskService.js'; // FIX: Consistent .js extension
import { PlusIcon, SearchIcon } from '../components/icons.jsx'; // FIX: Consistent .jsx extension
import TaskColumn from '../components/TaskColumn.jsx'; // FIX: Consistent .jsx extension
import TaskModal from '../components/TaskModal.jsx'; // FIX: Consistent .jsx extension
import DeleteConfirmationModal from '../components/DeleteConfirmationModal.jsx'; // FIX: Consistent .jsx extension

// Receive user and logout function as props from App.jsx
export default function KanbanBoard({ onLogout, user }) {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [modalMode, setModalMode] = useState('add');
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null); // New state for API errors

    // Function to fetch tasks, centralized for use in useEffect and after CRUD operations
    const fetchTasks = async () => {
        try {
            setError(null);
            setIsLoading(true);
            const fetchedTasks = await taskService.getTasks();
            setTasks(fetchedTasks);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
            // On a 401 error, the AuthProvider should automatically redirect,
            // but for other errors, display a message.
            setError("Failed to load tasks. You may need to log in again.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- Fetch tasks from the service on component mount ---
    useEffect(() => {
        // We only fetch tasks if the user object confirms they are logged in
        if (user && user.isAuthenticated !== false) {
            fetchTasks();
        } else {
             // If not authenticated, we stop loading state immediately and wait for AuthProvider to redirect
            setIsLoading(false);
        }
    }, [user]); // Re-run effect when user state changes (i.e., after login)

    const handleAddTaskClick = () => {
        setModalMode('add');
        setCurrentTask(null);
        setIsModalOpen(true);
    };

    // Refactored to use centralized fetchTasks after successful CRUD
    const handleSaveTask = async (taskData) => {
        try {
            // Note: status is required for the backend, ensure it's provided.
            const dataToSave = { 
                ...taskData,
                status: taskData.status || 'To Do' // Ensures we send a valid status
            };
            
            if (modalMode === 'add') {
                await taskService.addTask(dataToSave);
            } else {
                await taskService.updateTask(dataToSave);
            }
            await fetchTasks(); // Refresh list after saving
        } catch (error) {
            console.error("Failed to save task:", error);
            setError("Error saving task. Check if the server is running or if you have permission.");
        } finally {
            setIsModalOpen(false);
            setCurrentTask(null);
        }
    };

    const confirmDelete = async () => {
        if (!currentTask) return;
        try {
            await taskService.deleteTask(currentTask.id);
            await fetchTasks(); // Refresh list after deleting
        } catch (error) {
            console.error("Failed to delete task:", error);
            setError("Error deleting task. Check your permissions (RBAC).");
        } finally {
            setIsDeleteConfirmOpen(false);
            setCurrentTask(null);
        }
    };
    
    // ... (rest of the component logic remains the same for filtering and memoization)

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => 
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [tasks, searchTerm]);

    const tasksByStatus = useMemo(() => {
        return STATUSES.reduce((acc, status) => {
            // NOTE: The backend task object uses 'status' property, 
            // so we filter on 'task.status'
            acc[status] = filteredTasks.filter(task => task.status === status);
            return acc;
        }, {});
    }, [filteredTasks]);


    const handleEditTaskClick = (task) => {
        setModalMode('edit');
        setCurrentTask(task);
        setIsModalOpen(true);
    };

    const handleDeleteTaskClick = (task) => {
        setCurrentTask(task);
        setIsDeleteConfirmOpen(true);
    };


    return (
        // Ensured this container class is robust for dark mode and font
        <div className="bg-slate-900 min-h-screen text-white font-sans selection:bg-teal-500/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                
                {/* Header */}
                <header className="flex flex-col sm:flex-row justify-between items-center mb-8 md:mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">TaskForge</h1>
                        <p className="text-slate-400 mt-1">
                            Welcome, {user.name} . Your personal command center.
                        </p>
                    </div>
                    <div className="flex gap-4 w-full sm:w-auto mt-6 sm:mt-0">
                        <button 
                            onClick={handleAddTaskClick}
                            className="flex-1 sm:flex-grow-0 flex items-center justify-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 rounded-lg shadow-lg shadow-teal-500/20 transition-all duration-300 transform hover:scale-105"
                        >
                            <PlusIcon />
                            Add New Task
                        </button>
                        <button 
                            onClick={onLogout}
                            className="flex-1 sm:flex-grow-0 flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg shadow-lg transition-all duration-300"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* Error Message Display */}
                {error && (
                    <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 mb-6 rounded-lg text-center">
                        {error}
                    </div>
                )}

                {/* Search */}
                <div className="mb-8">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <SearchIcon />
                        </span>
                        <input 
                            type="text"
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Kanban Board */}
                {isLoading ? (
                    <div className="text-center text-slate-400 py-10">Loading tasks...</div>
                ) : (
                    <div className="flex flex-col md:flex-row gap-6">
                        {STATUSES.map(status => (
                            <TaskColumn
                                key={status}
                                status={status}
                                tasks={tasksByStatus[status]}
                                onEdit={handleEditTaskClick}
                                onDelete={handleDeleteTaskClick}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            {isModalOpen && <TaskModal mode={modalMode} task={currentTask} onSave={handleSaveTask} onClose={() => setIsModalOpen(false)} />}
            {isDeleteConfirmOpen && <DeleteConfirmationModal onConfirm={confirmDelete} onClose={() => setIsDeleteConfirmOpen(false)} />}
        </div>
    );
}
// import React, { useState, useMemo, useEffect } from 'react';
// import { STATUSES } from '../data/constants.js'; // FIX: Added .js extension
// import * as taskService from '../services/taskService.js'; // FIX: Added .js extension
// import { PlusIcon, SearchIcon } from '../components/icons.jsx'; // FIX: Added .jsx extension
// import TaskColumn from '../components/TaskColumn.jsx'; // FIX: Added .jsx extension
// import TaskModal from '../components/TaskModal.jsx'; // FIX: Added .jsx extension
// import DeleteConfirmationModal from '../components/DeleteConfirmationModal.jsx'; // FIX: Added .jsx extension

// // Receive user and logout function as props from App.jsx
// export default function KanbanBoard({ onLogout, user }) {
//     const [tasks, setTasks] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
//     const [currentTask, setCurrentTask] = useState(null);
//     const [modalMode, setModalMode] = useState('add');
//     const [searchTerm, setSearchTerm] = useState('');
//     const [error, setError] = useState(null); // New state for API errors

//     // Function to fetch tasks, centralized for use in useEffect and after CRUD operations
//     const fetchTasks = async () => {
//         try {
//             setError(null);
//             setIsLoading(true);
//             const fetchedTasks = await taskService.getTasks();
//             setTasks(fetchedTasks);
//         } catch (error) {
//             console.error("Failed to fetch tasks:", error);
//             // On a 401 error, the AuthProvider should automatically redirect,
//             // but for other errors, display a message.
//             setError("Failed to load tasks. You may need to log in again.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // --- Fetch tasks from the service on component mount ---
//     useEffect(() => {
//         // We only fetch tasks if the user object confirms they are logged in
//         if (user && user.isAuthenticated !== false) {
//             fetchTasks();
//         } else {
//              // If not authenticated, we stop loading state immediately and wait for AuthProvider to redirect
//             setIsLoading(false);
//         }
//     }, [user]); // Re-run effect when user state changes (i.e., after login)

//     const handleAddTaskClick = () => {
//         setModalMode('add');
//         setCurrentTask(null);
//         setIsModalOpen(true);
//     };

//     // Refactored to use centralized fetchTasks after successful CRUD
//     const handleSaveTask = async (taskData) => {
//         try {
//             // Note: status is required for the backend, ensure it's provided.
//             const dataToSave = { 
//                 ...taskData,
//                 status: taskData.status || 'To Do' // Ensures we send a valid status
//             };
            
//             if (modalMode === 'add') {
//                 await taskService.addTask(dataToSave);
//             } else {
//                 await taskService.updateTask(dataToSave);
//             }
//             await fetchTasks(); // Refresh list after saving
//         } catch (error) {
//             console.error("Failed to save task:", error);
//             setError("Error saving task. Check if the server is running or if you have permission.");
//         } finally {
//             setIsModalOpen(false);
//             setCurrentTask(null);
//         }
//     };

//     const confirmDelete = async () => {
//         if (!currentTask) return;
//         try {
//             await taskService.deleteTask(currentTask.id);
//             await fetchTasks(); // Refresh list after deleting
//         } catch (error) {
//             console.error("Failed to delete task:", error);
//             setError("Error deleting task. Check your permissions (RBAC).");
//         } finally {
//             setIsDeleteConfirmOpen(false);
//             setCurrentTask(null);
//         }
//     };
    
//     // ... (rest of the component logic remains the same for filtering and memoization)

//     const filteredTasks = useMemo(() => {
//         return tasks.filter(task => 
//             task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             task.description.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//     }, [tasks, searchTerm]);

//     const tasksByStatus = useMemo(() => {
//         return STATUSES.reduce((acc, status) => {
//             // NOTE: The backend task object uses 'status' property, 
//             // so we filter on 'task.status'
//             acc[status] = filteredTasks.filter(task => task.status === status);
//             return acc;
//         }, {});
//     }, [filteredTasks]);


//     const handleEditTaskClick = (task) => {
//         setModalMode('edit');
//         setCurrentTask(task);
//         setIsModalOpen(true);
//     };

//     const handleDeleteTaskClick = (task) => {
//         setCurrentTask(task);
//         setIsDeleteConfirmOpen(true);
//     };


//     return (
//         <div className="bg-slate-900 min-h-screen text-white font-sans selection:bg-teal-500/30">
//             <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                
//                 {/* Header */}
//                 <header className="flex flex-col sm:flex-row justify-between items-center mb-8 md:mb-12">
//                     <div>
//                         <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">TaskForge</h1>
//                         <p className="text-slate-400 mt-1">
//                             Welcome, {user.name} ({user.role}). Your personal command center.
//                         </p>
//                     </div>
//                     <div className="flex gap-4 w-full sm:w-auto mt-6 sm:mt-0">
//                         <button 
//                             onClick={handleAddTaskClick}
//                             className="flex-1 sm:flex-grow-0 flex items-center justify-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 rounded-lg shadow-lg shadow-teal-500/20 transition-all duration-300 transform hover:scale-105"
//                         >
//                             <PlusIcon />
//                             Add New Task
//                         </button>
//                         <button 
//                             onClick={onLogout}
//                             className="flex-1 sm:flex-grow-0 flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg shadow-lg transition-all duration-300"
//                         >
//                             Logout
//                         </button>
//                     </div>
//                 </header>

//                 {/* Error Message Display */}
//                 {error && (
//                     <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 mb-6 rounded-lg text-center">
//                         {error}
//                     </div>
//                 )}

//                 {/* Search */}
//                 <div className="mb-8">
//                     <div className="relative">
//                         <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                             <SearchIcon />
//                         </span>
//                         <input 
//                             type="text"
//                             placeholder="Search tasks..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
//                         />
//                     </div>
//                 </div>

//                 {/* Kanban Board */}
//                 {isLoading ? (
//                     <div className="text-center text-slate-400 py-10">Loading tasks...</div>
//                 ) : (
//                     <div className="flex flex-col md:flex-row gap-6">
//                         {STATUSES.map(status => (
//                             <TaskColumn
//                                 key={status}
//                                 status={status}
//                                 tasks={tasksByStatus[status]}
//                                 onEdit={handleEditTaskClick}
//                                 onDelete={handleDeleteTaskClick}
//                             />
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {/* Modals */}
//             {isModalOpen && <TaskModal mode={modalMode} task={currentTask} onSave={handleSaveTask} onClose={() => setIsModalOpen(false)} />}
//             {isDeleteConfirmOpen && <DeleteConfirmationModal onConfirm={confirmDelete} onClose={() => setIsDeleteConfirmOpen(false)} />}
//         </div>
//     );
// }
// // // src/pages/KanbanBoard.jsx

// // import React, { useState, useMemo, useEffect } from 'react';
// // import { STATUSES } from '../data/constants';
// // import * as taskService from '../services/taskService'; // Import the service
// // import { PlusIcon, SearchIcon } from '../components/icons';
// // import TaskColumn from '../components/TaskColumn';
// // import TaskModal from '../components/TaskModal';
// // import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

// // export default function KanbanBoard() {
// //     const [tasks, setTasks] = useState([]);
// //     const [isLoading, setIsLoading] = useState(true); // Loading state
// //     const [isModalOpen, setIsModalOpen] = useState(false);
// //     const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
// //     const [currentTask, setCurrentTask] = useState(null);
// //     const [modalMode, setModalMode] = useState('add');
// //     const [searchTerm, setSearchTerm] = useState('');

// //     // --- Fetch tasks from the service on component mount ---
// //     useEffect(() => {
// //         const fetchTasks = async () => {
// //             try {
// //                 const fetchedTasks = await taskService.getTasks();
// //                 setTasks(fetchedTasks);
// //             } catch (error) {
// //                 console.error("Failed to fetch tasks:", error);
// //                 // Optionally, set an error state to show a message to the user
// //             } finally {
// //                 setIsLoading(false);
// //             }
// //         };

// //         fetchTasks();
// //     }, []); // Empty dependency array means this runs once on mount

// //     const handleAddTaskClick = () => {
// //         setModalMode('add');
// //         setCurrentTask(null);
// //         setIsModalOpen(true);
// //     };

// //     const handleEditTaskClick = (task) => {
// //         setModalMode('edit');
// //         setCurrentTask(task);
// //         setIsModalOpen(true);
// //     };

// //     const handleDeleteTaskClick = (task) => {
// //         setCurrentTask(task);
// //         setIsDeleteConfirmOpen(true);
// //     };

// //     const handleSaveTask = async (taskData) => {
// //         try {
// //             if (modalMode === 'add') {
// //                 const newTask = await taskService.addTask(taskData);
// //                 setTasks(prevTasks => [...prevTasks, newTask]);
// //             } else {
// //                 const updatedTask = await taskService.updateTask(taskData);
// //                 setTasks(prevTasks => prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task));
// //             }
// //         } catch (error) {
// //             console.error("Failed to save task:", error);
// //         } finally {
// //             setIsModalOpen(false);
// //             setCurrentTask(null);
// //         }
// //     };

// //     const confirmDelete = async () => {
// //         if (!currentTask) return;
// //         try {
// //             await taskService.deleteTask(currentTask.id);
// //             setTasks(prevTasks => prevTasks.filter(task => task.id !== currentTask.id));
// //         } catch (error) {
// //             console.error("Failed to delete task:", error);
// //         } finally {
// //             setIsDeleteConfirmOpen(false);
// //             setCurrentTask(null);
// //         }
// //     };

// //     const filteredTasks = useMemo(() => {
// //         return tasks.filter(task => 
// //             task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //             task.description.toLowerCase().includes(searchTerm.toLowerCase())
// //         );
// //     }, [tasks, searchTerm]);

// //     const tasksByStatus = useMemo(() => {
// //         return STATUSES.reduce((acc, status) => {
// //             acc[status] = filteredTasks.filter(task => task.status === status);
// //             return acc;
// //         }, {});
// //     }, [filteredTasks]);

// //     return (
// //         <div className="bg-slate-900 min-h-screen text-white font-sans selection:bg-teal-500/30">
// //             <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
// //                 {/* Header */}
// //                 <header className="flex flex-col sm:flex-row justify-between items-center mb-8 md:mb-12">
// //                     <div>
// //                         <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">TaskForge</h1>
// //                         <p className="text-slate-400 mt-1">Your personal command center for tasks.</p>
// //                     </div>
// //                     <button 
// //                         onClick={handleAddTaskClick}
// //                         className="w-full sm:w-auto mt-6 sm:mt-0 flex items-center justify-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 rounded-lg shadow-lg shadow-teal-500/20 transition-all duration-300 transform hover:scale-105"
// //                     >
// //                         <PlusIcon />
// //                         Add New Task
// //                     </button>
// //                 </header>

// //                 {/* Search */}
// //                 <div className="mb-8">
// //                     <div className="relative">
// //                         <span className="absolute inset-y-0 left-0 flex items-center pl-3">
// //                             <SearchIcon className="text-slate-500"/>
// //                         </span>
// //                         <input 
// //                             type="text"
// //                             placeholder="Search tasks..."
// //                             value={searchTerm}
// //                             onChange={(e) => setSearchTerm(e.target.value)}
// //                             className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
// //                         />
// //                     </div>
// //                 </div>

// //                 {/* Kanban Board */}
// //                 {isLoading ? (
// //                     <div className="text-center text-slate-400 py-10">Loading tasks...</div>
// //                 ) : (
// //                     <div className="flex flex-col md:flex-row gap-6">
// //                         {STATUSES.map(status => (
// //                             <TaskColumn
// //                                 key={status}
// //                                 status={status}
// //                                 tasks={tasksByStatus[status]}
// //                                 onEdit={handleEditTaskClick}
// //                                 onDelete={handleDeleteTaskClick}
// //                             />
// //                         ))}
// //                     </div>
// //                 )}
// //             </div>

// //             {/* Modals */}
// //             {isModalOpen && <TaskModal mode={modalMode} task={currentTask} onSave={handleSaveTask} onClose={() => setIsModalOpen(false)} />}
// //             {isDeleteConfirmOpen && <DeleteConfirmationModal onConfirm={confirmDelete} onClose={() => setIsDeleteConfirmOpen(false)} />}
// //         </div>
// //     );
// // }