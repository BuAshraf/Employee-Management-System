import api, { apiCall } from '../utils/api';

const base = '/notifications';

const getCurrentUserId = () => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return 1; // fallback for dev
    const user = JSON.parse(raw);
    return user.id || user.userId || 1; // best-effort fallback
  } catch {
    return 1;
  }
};

const NotificationService = {
  getUserNotifications: async ({ userId = getCurrentUserId(), page = 0, size = 20 } = {}) => {
    const res = await apiCall.get(`${base}`, { params: { userId, page, size } });
    return res.data; // Page<NotificationResponse>
  },

  getUnread: async ({ userId = getCurrentUserId() } = {}) => {
    const res = await apiCall.get(`${base}/unread`, { params: { userId } });
    return res.data; // NotificationResponse[]
  },

  getSummary: async ({ userId = getCurrentUserId() } = {}) => {
    const res = await apiCall.get(`${base}/summary`, { params: { userId } });
    return res.data; // NotificationSummary
  },

  getById: async (id, { userId = getCurrentUserId() } = {}) => {
    const res = await apiCall.get(`${base}/${id}`, { params: { userId } });
    return res.data; // NotificationResponse
  },

  markAsRead: async (id, { userId = getCurrentUserId() } = {}) => {
    await apiCall.put(`${base}/${id}/read`, {}, { params: { userId } });
  },

  markAllAsRead: async ({ userId = getCurrentUserId() } = {}) => {
    await apiCall.put(`${base}/read-all`, {}, { params: { userId } });
  },

  delete: async (id, { userId = getCurrentUserId() } = {}) => {
    await apiCall.delete(`${base}/${id}`, { params: { userId } });
  },
  remove: async (id, { userId = getCurrentUserId() } = {}) => {
    await apiCall.delete(`${base}/${id}`, { params: { userId } });
  },

  create: async (payload) => {
    const res = await apiCall.post(`${base}`, payload);
    return res.data; // NotificationResponse
  },

  filter: async ({ userId = getCurrentUserId(), isRead, type, priority, page = 0, size = 20 } = {}) => {
    const params = { userId, page, size };
    if (typeof isRead === 'boolean') params.isRead = isRead;
    if (type) params.type = type;
    if (priority) params.priority = priority;
    const res = await apiCall.get(`${base}/filter`, { params });
    return res.data; // Page<NotificationResponse>
  },
};

export default NotificationService;
