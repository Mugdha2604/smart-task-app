// src/data/constants.js

export const initialTasks = [
    { id: 1, title: 'Finalize Q4 Report', description: 'Compile all data from departments and finalize the quarterly report for the board meeting.', status: 'In Progress', dueDate: '2025-11-10' },
    { id: 2, title: 'Design Landing Page Mockup', description: 'Create a high-fidelity mockup for the new landing page using Figma. Focus on a clean and modern aesthetic.', status: 'To Do', dueDate: '2025-10-25' },
    { id: 3, title: 'Fix API Authentication Bug', description: 'Investigate and resolve the authentication issue on the main API gateway. It is a critical priority.', status: 'Done', dueDate: '2025-10-15' },
    { id: 4, title: 'Plan Team Offsite Event', description: 'Organize logistics for the annual team offsite, including venue, activities, and travel arrangements.', status: 'To Do', dueDate: '2025-12-01' },
    { id: 5, title: 'Onboard New Frontend Developer', description: 'Prepare onboarding documents and schedule introduction meetings for the new hire starting next week.', status: 'In Progress', dueDate: '2025-10-08' },
    { id: 6, title: 'User Acceptance Testing (UAT)', description: 'Coordinate with the QA team to conduct the final round of UAT for the v2.0 release.', status: 'To Do', dueDate: '2025-10-18' },
];

export const STATUSES = ['To Do', 'In Progress', 'Done'];

export const statusConfig = {
    'To Do': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', dot: 'bg-yellow-400', border: 'border-yellow-500/50' },
    'In Progress': { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-400', border: 'border-blue-500/50' },
    'Done': { bg: 'bg-green-500/10', text: 'text-green-400', dot: 'bg-green-400', border: 'border-green-500/50' },
};