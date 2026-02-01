import CreditCard from '../models/CreditCard.js';

// Get all credit cards for user
export const getAllCreditCards = async (req, res) => {
  try {
    const creditCards = await CreditCard.findAll(req.user.id);
    res.json({ credit_cards: creditCards });
  } catch (error) {
    console.error('Get credit cards error:', error);
    res.status(500).json({ error: 'Failed to fetch credit cards' });
  }
};

// Get single credit card
export const getCreditCard = async (req, res) => {
  try {
    const { id } = req.params;
    const creditCard = await CreditCard.findById(id, req.user.id);

    if (!creditCard) {
      return res.status(404).json({ error: 'Credit card not found' });
    }

    res.json({ credit_card: creditCard });
  } catch (error) {
    console.error('Get credit card error:', error);
    res.status(500).json({ error: 'Failed to fetch credit card' });
  }
};

// Create credit card
export const createCreditCard = async (req, res) => {
  try {
    const creditCardData = {
      ...req.body,
      user_id: req.user.id
    };
    const creditCard = await CreditCard.create(creditCardData);
    res.status(201).json({ message: 'Credit card created', credit_card: creditCard });
  } catch (error) {
    console.error('Create credit card error:', error);
    res.status(500).json({ error: 'Failed to create credit card' });
  }
};

// Update credit card
export const updateCreditCard = async (req, res) => {
  try {
    const { id } = req.params;
    const creditCard = await CreditCard.update(id, req.user.id, req.body);

    if (!creditCard) {
      return res.status(404).json({ error: 'Credit card not found' });
    }

    res.json({ message: 'Credit card updated', credit_card: creditCard });
  } catch (error) {
    console.error('Update credit card error:', error);
    res.status(500).json({ error: 'Failed to update credit card' });
  }
};

// Delete credit card
export const deleteCreditCard = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CreditCard.delete(id, req.user.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Credit card not found' });
    }

    res.json({ message: 'Credit card deleted successfully' });
  } catch (error) {
    console.error('Delete credit card error:', error);
    res.status(500).json({ error: 'Failed to delete credit card' });
  }
};

// Get credit card with utilization
export const getCreditCardUtilization = async (req, res) => {
  try {
    const { id } = req.params;
    const card = await CreditCard.getUtilization(id, req.user.id);

    if (!card) {
      return res.status(404).json({ error: 'Credit card not found' });
    }

    res.json({ credit_card: card });
  } catch (error) {
    console.error('Get utilization error:', error);
    res.status(500).json({ error: 'Failed to fetch credit card utilization' });
  }
};

// Get high utilization cards
export const getHighUtilizationCards = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 70;
    const cards = await CreditCard.findHighUtilization(req.user.id, threshold);
    res.json({ credit_cards: cards });
  } catch (error) {
    console.error('Get high utilization cards error:', error);
    res.status(500).json({ error: 'Failed to fetch high utilization cards' });
  }
};
