const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '../../public');
const LANDING_PAGE = path.join(PUBLIC_DIR, 'index.html');
const LOGIN_PAGE = path.join(PUBLIC_DIR, 'pages/auth/login.html');
const SIGNUP_PAGE = path.join(PUBLIC_DIR, 'pages/auth/signup.html');
const ADMIN_DASHBOARD = path.join(PUBLIC_DIR, 'pages/admin/dashboard.html');
const ADMIN_ADD_RESULT_PAGE = path.join(PUBLIC_DIR, 'pages/admin/result/add.html');
const ADMIN_UPDATE_RESULT_PAGE = path.join(PUBLIC_DIR, 'pages/admin/result/update.html');
const ADMIN_DELETE_RESULT_PAGE = path.join(PUBLIC_DIR, 'pages/admin/result/delete.html');
const STUDENT_DASHBOARD = path.join(PUBLIC_DIR, 'pages/student/dashboard.html');


module.exports = {
    PUBLIC_DIR,
    LANDING_PAGE,
    LOGIN_PAGE,
    SIGNUP_PAGE,
    ADMIN_DASHBOARD,
    ADMIN_ADD_RESULT_PAGE,
    ADMIN_UPDATE_RESULT_PAGE,
    ADMIN_DELETE_RESULT_PAGE,
    STUDENT_DASHBOARD
};