import Subscription from '../models/Subscription.js';

// Get all subscriptions for user
export const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll(req.user.id);
    res.json({ subscriptions });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
};

// Get single subscription
export const getSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findById(id, req.user.id);

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json({ subscription });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
};

// Create subscription
export const createSubscription = async (req, res) => {
  try {
    const subscriptionData = {
      ...req.body,
      user_id: req.user.id
    };
    const subscription = await Subscription.create(subscriptionData);
    res.status(201).json({ message: 'Subscription created', subscription });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
};

// Update subscription
export const updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.update(id, req.user.id, req.body);

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json({ message: 'Subscription updated', subscription });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({ error: 'Failed to update subscription' });
  }
};

// Delete subscription
export const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Subscription.delete(id, req.user.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    console.error('Delete subscription error:', error);
    res.status(500).json({ error: 'Failed to delete subscription' });
  }
};

// Get active subscriptions
export const getActiveSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.findActive(req.user.id);
    res.json({ subscriptions });
  } catch (error) {
    console.error('Get active subscriptions error:', error);
    res.status(500).json({ error: 'Failed to fetch active subscriptions' });
  }
};

// Get upcoming payments
export const getUpcomingPayments = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const subscriptions = await Subscription.findUpcoming(req.user.id, days);
    res.json({ subscriptions });
  } catch (error) {
    console.error('Get upcoming payments error:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming payments' });
  }
};
