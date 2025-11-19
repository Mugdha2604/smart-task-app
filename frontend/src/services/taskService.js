import axios from 'axios';

// IMPORTANT: Configure Axios to send cookies (JWT) with every request
axios.defaults.withCredentials = true;

// Define the Base URL for the versioned API
const API_BASE_URL = 'http://localhost:5000/api/v1'; // Adjust port if needed

// --- Helper Function to map backend data to frontend structure ---
const mapTaskData = (task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    // FIX: Map the backend status field to frontend expectation. 
    // Assuming backend returns 'status', otherwise default to 'To Do'.
    status: task.status || 'To Do', 
    // Use a placeholder or actual due date field if one exists in the backend model
    dueDate: task.dueDate || 'N/A' 
});

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
    // Apply mapping to ensure frontend displays correctly
    return response.data.map(mapTaskData);
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
// // In a real app, this would be an environment variable (process.env.REACT_APP_API_URL)
// const API_BASE_URL = 'http://localhost:5000/api/v1'; // Adjust port if needed

// // --- AUTHENTICATION API CALLS ---

// export const registerUser = async (userData) => {
//     // This calls POST /api/v1/auth/register
    
//     try {
//         const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
//         return response.data;
//     } catch (err)
//     {
//         console.log(err);
//     }
    
// };

// export const loginUser = async (credentials) => {
//     // This calls POST /api/v1/auth/login, which sets the HttpOnly cookie
//     try {
//         const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
//     // Returns the user object, the JWT token is in the cookie header (not body)
//     return response.data.user;
//     } catch (err)
//     {
//         console.log(err);
//     } 
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
//     // This request relies on the 'jwt' cookie being sent automatically
//     const response = await axios.get(TASK_API_URL);
//     return response.data;
// };

// export const addTask = async (taskData) => {
//     console.log("Adding task...", taskData);
//     const response = await axios.post(TASK_API_URL, taskData);
//     return response.data;
// };

// export const updateTask = async (taskData) => {
//     console.log("Updating task...", taskData);
//     // Note: The task object from the backend will have 'id' and 'UserId'
//     const response = await axios.put(`${TASK_API_URL}/${taskData.id}`, taskData);
//     return response.data;
// };

// export const deleteTask = async (taskId) => {
//     console.log("Deleting task...", taskId);
//     await axios.delete(`${TASK_API_URL}/${taskId}`);
//     return true;
// };

// // Simple check to see if the user is authenticated 
// // (e.g., used by a protected route wrapper)
// export const checkAuthStatus = async () => {
//     try {
//         // We attempt to fetch the protected tasks list. 
//         // If it succeeds, the user is logged in.
//         const response = await axios.get(TASK_API_URL);
//         // The task response doesn't return the full user object, so we'll 
//         // rely on a separate endpoint in a real app, but for simplicity, 
//         // if this protected call works, we assume they're logged in.
//         console.log(response);
//         return { isAuthenticated: true, user: { role: 'unknown' } };
//     } catch (error) {
//         // Any 401 or network error means the token is invalid or missing
//         console.log(error);
//         return { isAuthenticated: false, user: null };
//     }
// };