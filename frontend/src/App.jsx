import React, { useState, createContext, useEffect, useContext } from 'react';
import KanbanBoard from './pages/KanbanBoard.jsx'; 
import { LoginComponent, RegisterComponent } from './pages/AuthForms.jsx';
import * as taskService from './services/taskService.js';
import { ToastContainer, toast } from 'react-toastify'; // <-- Added toast import
import 'react-toastify/dist/ReactToastify.css';

// 1. Define the Authentication Context
const AuthContext = createContext(null);

// 2. Auth Provider Component
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1) || 'tasks');

    // Simple Hash Router Listener
    useEffect(() => {
        const handleHashChange = () => {
            setCurrentPath(window.location.hash.slice(1) || 'tasks');
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Check auth status on initial load (via protected route)
    useEffect(() => {
        const verifySession = async () => {
            try {
                await taskService.getTasks();
                setUser({ isAuthenticated: true, role: 'unknown', name: 'User' }); 
            } catch (error) {
                setUser(null);
                window.location.hash = 'login';
            } finally {
                setIsLoading(false);
            }
        };

        verifySession();
    }, []);

    const login = (userData) => {
        setUser(userData); 
        window.location.hash = 'tasks';
        toast.success(`Login successful! Welcome, ${userData.name}.`); // Login Successful Notification
    };

    const logout = async () => {
        try {
            await taskService.logoutUser();
            toast.info('Logout successful.'); // Logout Successful Notification
        } catch (error) {
            console.error('Logout failed silently:', error);
            toast.error('Logout failed.');
        } finally {
            setUser(null);
            window.location.hash = 'login';
        }
    };

    const value = { user, isLoading, login, logout, currentPath };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. Main Layout/Router Component
const AppRouter = () => {
    const { user, isLoading, login, logout, currentPath } = useContext(AuthContext);

    if (isLoading) {
        return (
            <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">
                <p>Loading session...</p>
            </div>
        );
    }

    let ComponentToRender;

    if (user) {
        if (currentPath === 'tasks' || currentPath === '') {
            ComponentToRender = <KanbanBoard onLogout={logout} user={user} />;
        } else {
            ComponentToRender = <KanbanBoard onLogout={logout} user={user} />;
        }
    } else {
        if (currentPath === 'register') {
            ComponentToRender = (
                <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                    <RegisterComponent 
                        onRegisterSuccess={() => { window.location.hash = 'login'; }} 
                        onSwitchToLogin={() => { window.location.hash = 'login'; }}
                    />
                </div>
            );
        } else {
            ComponentToRender = (
                <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                    <LoginComponent 
                        onLoginSuccess={login} 
                        onSwitchToRegister={() => { window.location.hash = 'register'; }}
                    />
                </div>
            );
        }
    }

    return ComponentToRender;
};

// 4. Export the root App component
function App() {
    return (
        <AuthProvider>
            <AppRouter />
            {/* NEW: Toastify Container for professional notifications */}
            <ToastContainer 
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </AuthProvider>
    );
}

export default App;
// import React, { useState, createContext, useEffect, useContext } from 'react';
// import KanbanBoard from './pages/KanbanBoard.jsx'; // FIX: Added .jsx extension
// import { LoginComponent, RegisterComponent } from './pages/AuthForms.jsx'; // FIX: Added .jsx extension
// import * as taskService from './services/taskService.js'; // FIX: Added .js extension
// import { PlusIcon } from './components/icons.jsx'; // FIX: Added .jsx extension (Good practice)

// // 1. Define the Authentication Context
// const AuthContext = createContext(null);

// // 2. Auth Provider Component
// const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1) || 'tasks');

//     // Simple Hash Router Listener
//     useEffect(() => {
//         const handleHashChange = () => {
//             setCurrentPath(window.location.hash.slice(1) || 'tasks');
//         };
//         window.addEventListener('hashchange', handleHashChange);
//         return () => window.removeEventListener('hashchange', handleHashChange);
//     }, []);

//     // Check auth status on initial load (via protected route)
//     useEffect(() => {
//         const verifySession = async () => {
//             try {
//                 // Attempt to make a protected API call (getTasks)
//                 // If it succeeds, the cookie is valid, and the user is logged in.
//                 // NOTE: We don't get the user details back easily, so this is a simplified check.
//                 await taskService.getTasks();
//                 // Since we succeeded, we assume the user data is handled elsewhere or is minimal.
//                 setUser({ isAuthenticated: true, role: 'unknown', name: 'User' }); 
//             } catch (error) {
//                 // 401 Unauthorized or network error
//                 setUser(null);
//                 // Redirect to login if a session check fails
//                 console.log(error);
//                 window.location.hash = 'login';
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         verifySession();
//     }, []);

//     const login = (userData) => {
//         // When login succeeds, update user data with details from the backend
//         setUser(userData); 
//         window.location.hash = 'tasks';
//     };

//     const logout = async () => {
//         try {
//             await taskService.logoutUser();
//         } catch (error) {
//             console.error('Logout failed silently:', error);
//         } finally {
//             setUser(null);
//             window.location.hash = 'login';
//         }
//     };

//     const value = { user, isLoading, login, logout, currentPath };

//     return (
//         <AuthContext.Provider value={value}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// // 3. Main Layout/Router Component
// const AppRouter = () => {
//     const { user, isLoading, login, logout, currentPath } = useContext(AuthContext);

//     if (isLoading) {
//         return (
//             <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">
//                 <p>Loading session...</p>
//             </div>
//         );
//     }

//     let ComponentToRender;

//     if (user) {
//         // User is logged in, show protected pages
//         if (currentPath === 'tasks' || currentPath === '') {
//             ComponentToRender = <KanbanBoard onLogout={logout} user={user} />;
//         } else {
//             // Fallback for any protected route
//             ComponentToRender = <KanbanBoard onLogout={logout} user={user} />;
//         }
//     } else {
//         // User is not logged in, show auth pages
//         if (currentPath === 'register') {
//             ComponentToRender = (
//                 <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
//                     <RegisterComponent 
//                         onRegisterSuccess={() => { window.location.hash = 'login'; }} 
//                         onSwitchToLogin={() => { window.location.hash = 'login'; }}
//                     />
//                 </div>
//             );
//         } else {
//             // Default to login page
//             ComponentToRender = (
//                 <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
//                     <LoginComponent 
//                         onLoginSuccess={login} 
//                         onSwitchToRegister={() => { window.location.hash = 'register'; }}
//                     />
//                 </div>
//             );
//         }
//     }

//     return ComponentToRender;
// };

// // 4. Export the root App component
// function App() {
//     return (
//         <AuthProvider>
//             <AppRouter />
//         </AuthProvider>
//     );
// }

// export default App;
