import Membership from '../models/Membership.js';

// Get all memberships for user
export const getAllMemberships = async (req, res) => {
  try {
    const memberships = await Membership.findAll(req.user.id);
    res.json({ memberships });
  } catch (error) {
    console.error('Get memberships error:', error);
    res.status(500).json({ error: 'Failed to fetch memberships' });
  }
};

// Get single membership
export const getMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const membership = await Membership.findById(id, req.user.id);

    if (!membership) {
      return res.status(404).json({ error: 'Membership not found' });
    }

    res.json({ membership });
  } catch (error) {
    console.error('Get membership error:', error);
    res.status(500).json({ error: 'Failed to fetch membership' });
  }
};

// Create membership
export const createMembership = async (req, res) => {
  try {
    const membershipData = {
      ...req.body,
      user_id: req.user.id
    };
    const membership = await Membership.create(membershipData);
    res.status(201).json({ message: 'Membership created', membership });
  } catch (error) {
    console.error('Create membership error:', error);
    res.status(500).json({ error: 'Failed to create membership' });
  }
};

// Update membership
export const updateMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const membership = await Membership.update(id, req.user.id, req.body);

    if (!membership) {
      return res.status(404).json({ error: 'Membership not found' });
    }

    res.json({ message: 'Membership updated', membership });
  } catch (error) {
    console.error('Update membership error:', error);
    res.status(500).json({ error: 'Failed to update membership' });
  }
};

// Delete membership
export const deleteMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Membership.delete(id, req.user.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Membership not found' });
    }

    res.json({ message: 'Membership deleted successfully' });
  } catch (error) {
    console.error('Delete membership error:', error);
    res.status(500).json({ error: 'Failed to delete membership' });
  }
};

// Get expiring memberships
export const getExpiringMemberships = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const memberships = await Membership.findExpiring(req.user.id, days);
    res.json({ memberships });
  } catch (error) {
    console.error('Get expiring memberships error:', error);
    res.status(500).json({ error: 'Failed to fetch expiring memberships' });
  }
};
