import Notification from '../models/Notification.js';

// Get all notifications for user
export const getAllNotifications = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const notifications = await Notification.findAll(req.user.id, limit);
    res.json({ notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// Get single notification
export const getNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id, req.user.id);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ notification });
  } catch (error) {
    console.error('Get notification error:', error);
    res.status(500).json({ error: 'Failed to fetch notification' });
  }
};

// Create notification
export const createNotification = async (req, res) => {
  try {
    const notificationData = {
      ...req.body,
      user_id: req.user.id
    };
    const notification = await Notification.create(notificationData);
    res.status(201).json({ message: 'Notification created', notification });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.markAsRead(id, req.user.id);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const count = await Notification.markAllAsRead(req.user.id);
    res.json({ message: `Marked ${count} notifications as read`, count });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Notification.delete(id, req.user.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

// Get unread notifications
export const getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findUnread(req.user.id);
    res.json({ notifications });
  } catch (error) {
    console.error('Get unread notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch unread notifications' });
  }
};

// Get unread count
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.getUnreadCount(req.user.id);
    res.json({ count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
};

// Delete old notifications
export const deleteOldNotifications = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 90;
    const count = await Notification.deleteOld(req.user.id, days);
    res.json({ message: `Deleted ${count} old notifications`, count });
  } catch (error) {
    console.error('Delete old notifications error:', error);
    res.status(500).json({ error: 'Failed to delete old notifications' });
  }
};
