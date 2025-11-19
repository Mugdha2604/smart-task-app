import axios from 'axios';

// IMPORTANT: Configure Axios to send cookies (JWT) with every request
axios.defaults.withCredentials = true;

// Define the Base URL for the versioned API
const API_BASE_URL = 'http://localhost:5000/api/v1'; // Adjust port if needed

// --- Helper Function to map backend data to frontend structure ---
const mapTaskData = (task) => {
    if (!task || !task.id || !task.title) return null; 
    
    const rawDate = task.dueDate || ''; 
    
    return {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status || 'To Do', 
        dueDate: rawDate 
    }
};

// --- AUTHENTICATION API CALLS ---

export const registerUser = async (userData) => {
    // This calls POST /api/v1/auth/register
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return response.data;
};

export const loginUser = async (credentials) => {
    // This calls POST /api/v1/auth/login, which sets the HttpOnly cookie
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    // Returns the user object, the JWT token is in the cookie header (not body)
    return response.data.user; 
};

export const logoutUser = async () => {
    // This calls POST /api/v1/auth/logout, which clears the HttpOnly cookie
    await axios.post(`${API_BASE_URL}/auth/logout`);
    return true;
};

// --- TASK API CALLS ---

// Update the task API calls to use the correct versioned base URL
const TASK_API_URL = `${API_BASE_URL}/tasks`;

export const getTasks = async () => {
    console.log("Fetching tasks from protected endpoint...");
    const response = await axios.get(TASK_API_URL);
    
    // Filter out any null or malformed data after mapping
    return response.data
        .map(mapTaskData)
        .filter(task => task !== null); 
};

export const addTask = async (taskData) => {
    console.log("Adding task...", taskData);
    const response = await axios.post(TASK_API_URL, taskData);
    return mapTaskData(response.data);
};

export const updateTask = async (taskData) => {
    console.log("Updating task...", taskData);
    const response = await axios.put(`${TASK_API_URL}/${taskData.id}`, taskData);
    return mapTaskData(response.data);
};

export const deleteTask = async (taskId) => {
    console.log("Deleting task...", taskId);
    await axios.delete(`${TASK_API_URL}/${taskId}`);
    return true;
};

// Simple check to see if the user is authenticated 
export const checkAuthStatus = async () => {
    try {
        const response = await axios.get(TASK_API_URL);
        return { isAuthenticated: true, user: { role: 'unknown' } };
    } catch (error) {
        return { isAuthenticated: false, user: null };
    }
};
// import axios from 'axios';

// // IMPORTANT: Configure Axios to send cookies (JWT) with every request
// axios.defaults.withCredentials = true;

// // Define the Base URL for the versioned API
// const API_BASE_URL = 'http://localhost:5000/api/v1'; // Adjust port if needed

// // --- Helper Function to map backend data to frontend structure ---
// const mapTaskData = (task) => {
//     // Return null if the core data is missing, so we can filter it out later
//     if (!task || !task.id || !task.title) return null; 
    
//     const rawDate = task.dueDate || ''; // Use empty string for optional date field in forms
    
//     return {
//         id: task.id,
//         title: task.title,
//         description: task.description,
//         // FIX: Map the backend status field to frontend expectation. 
//         status: task.status || 'To Do', 
//         // Use raw date string for form input initialization
//         dueDate: rawDate 
//     }
// };

// // --- AUTHENTICATION API CALLS (Omitted for brevity) ---

// export const registerUser = async (userData) => {
//     // This calls POST /api/v1/auth/register
//     const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
//     return response.data;
// };

// export const loginUser = async (credentials) => {
//     // This calls POST /api/v1/auth/login, which sets the HttpOnly cookie
//     const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
//     // Returns the user object, the JWT token is in the cookie header (not body)
//     return response.data.user; 
// };

// export const logoutUser = async () => {
//     // This calls POST /api/v1/auth/logout, which clears the HttpOnly cookie
//     await axios.post(`${API_BASE_URL}/auth/logout`);
//     return true;
// };

// // --- TASK API CALLS ---

// // Update the task API calls to use the correct versioned base URL
// const TASK_API_URL = `${API_BASE_URL}/tasks`;

// export const getTasks = async () => {
//     console.log("Fetching tasks from protected endpoint...");
//     const response = await axios.get(TASK_API_URL);
    
//     // === FIX: Filter out any null or malformed data after mapping ===
//     return response.data
//         .map(mapTaskData)
//         .filter(task => task !== null); // <-- CRITICAL FILTER
// };

// export const addTask = async (taskData) => {
//     console.log("Adding task...", taskData);
//     const response = await axios.post(TASK_API_URL, taskData);
//     return mapTaskData(response.data);
// };

// export const updateTask = async (taskData) => {
//     console.log("Updating task...", taskData);
//     const response = await axios.put(`${TASK_API_URL}/${taskData.id}`, taskData);
//     return mapTaskData(response.data);
// };

// export const deleteTask = async (taskId) => {
//     console.log("Deleting task...", taskId);
//     await axios.delete(`${TASK_API_URL}/${taskId}`);
//     return true;
// };

// // Simple check to see if the user is authenticated 
// export const checkAuthStatus = async () => {
//     try {
//         const response = await axios.get(TASK_API_URL);
//         return { isAuthenticated: true, user: { role: 'unknown' } };
//     } catch (error) {
//         return { isAuthenticated: false, user: null };
//     }
// };
