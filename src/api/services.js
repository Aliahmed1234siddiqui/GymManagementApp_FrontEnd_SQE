import api from './axios';

// ── AUTH ──────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// ── MEMBERS ───────────────────────────────────────────
export const membersAPI = {
  getAll: (params) => api.get('/members', { params }),
  getOne: (id) => api.get(`/members/${id}`),
  create: (data) => api.post('/members/create', data),
  update: (id, data) => api.put(`/members/${id}`, data),
  updateStatus: (id, status) => api.put(`/members/${id}/status`, { status }),
  delete: (id) => api.delete(`/members/${id}`),
  getCard: (id) => api.get(`/members/${id}/card`),
  getNotifications: (id) => api.get(`/members/${id}/notifications`),
  markNotificationsRead: (id) => api.put(`/members/${id}/notifications/read`),
  uploadPhoto: (id, file) => {
    const form = new FormData();
    form.append('photo', file);
    return api.put(`/members/${id}/photo`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ── PLANS ─────────────────────────────────────────────
export const plansAPI = {
  getAll: () => api.get('/plans'),
  getOne: (id) => api.get(`/plans/${id}`),
  create: (data) => api.post('/plans/create', data),
  update: (id, data) => api.put(`/plans/update/${id}`, data),
  delete: (id) => api.delete(`/plans/${id}`),
};

// ── PAYMENTS ──────────────────────────────────────────
export const paymentsAPI = {
  getAll: (params) => api.get('/payments', { params }),
  create: (data) => api.post('/payments/create', data),
  updateStatus: (id, status) => api.put(`/payments/${id}/status`, { status }),
  sendReminders: () => api.post('/payments/send-renewal-reminders'),
  getMemberPayments: (id) => api.get(`/payments/member/${id}`),
};

// ── REPORTS ───────────────────────────────────────────
export const reportsAPI = {
  payments: (params) => api.get('/reports/payments', { params }),
  members: () => api.get('/reports/members'),
};

// ── DASHBOARD ─────────────────────────────────────────
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getMemberDashboard: () => api.get('/dashboard/member'),
};
