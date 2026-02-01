import Setting from '../models/Setting.js';

// Get user settings
export const getSettings = async (req, res) => {
  try {
    const settings = await Setting.findAll(req.user.id);
    // Convert integer to boolean for notifications_enabled
    if (settings.notifications_enabled !== undefined) {
      settings.notifications_enabled = Boolean(settings.notifications_enabled);
    }
    res.json({ settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

// Create settings (typically only if not exist)
export const createSettings = async (req, res) => {
  try {
    const settingsData = {
      user_id: req.user.id,
      ...req.body
    };
    const settings = await Setting.create(settingsData);
    res.status(201).json({ message: 'Settings created', settings });
  } catch (error) {
    console.error('Create settings error:', error);
    res.status(500).json({ error: 'Failed to create settings' });
  }
};

// Update settings
export const updateSettings = async (req, res) => {
  try {
    const settings = await Setting.update(req.user.id, req.body);
    // Convert integer to boolean for notifications_enabled
    if (settings.notifications_enabled !== undefined) {
      settings.notifications_enabled = Boolean(settings.notifications_enabled);
    }
    res.json({ message: 'Settings updated', settings });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
};

// Delete settings
export const deleteSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Setting.delete(id, req.user.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Settings not found' });
    }

    res.json({ message: 'Settings deleted successfully' });
  } catch (error) {
    console.error('Delete settings error:', error);
    res.status(500).json({ error: 'Failed to delete settings' });
  }
};
