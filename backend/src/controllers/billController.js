import Bill from '../models/Bill.js';

// Get all bills for user
export const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.findAll(req.user.id);
    res.json({ bills });
  } catch (error) {
    console.error('Get bills error:', error);
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
};

// Get single bill
export const getBill = async (req, res) => {
  try {
    const { id } = req.params;
    const bill = await Bill.findById(id, req.user.id);

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    res.json({ bill });
  } catch (error) {
    console.error('Get bill error:', error);
    res.status(500).json({ error: 'Failed to fetch bill' });
  }
};

// Create bill
export const createBill = async (req, res) => {
  try {
    const billData = {
      ...req.body,
      user_id: req.user.id
    };
    const bill = await Bill.create(billData);
    res.status(201).json({ message: 'Bill created', bill });
  } catch (error) {
    console.error('Create bill error:', error);
    res.status(500).json({ error: 'Failed to create bill' });
  }
};

// Update bill
export const updateBill = async (req, res) => {
  try {
    const { id } = req.params;
    const bill = await Bill.update(id, req.user.id, req.body);

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    res.json({ message: 'Bill updated', bill });
  } catch (error) {
    console.error('Update bill error:', error);
    res.status(500).json({ error: 'Failed to update bill' });
  }
};

// Delete bill
export const deleteBill = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Bill.delete(id, req.user.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    res.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    console.error('Delete bill error:', error);
    res.status(500).json({ error: 'Failed to delete bill' });
  }
};

// Get overdue bills
export const getOverdueBills = async (req, res) => {
  try {
    const bills = await Bill.findOverdue(req.user.id);
    res.json({ bills });
  } catch (error) {
    console.error('Get overdue bills error:', error);
    res.status(500).json({ error: 'Failed to fetch overdue bills' });
  }
};

// Get upcoming bills
export const getUpcomingBills = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const bills = await Bill.findUpcoming(req.user.id, days);
    res.json({ bills });
  } catch (error) {
    console.error('Get upcoming bills error:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming bills' });
  }
};

// Get recurring bills
export const getRecurringBills = async (req, res) => {
  try {
    const bills = await Bill.findRecurring(req.user.id);
    res.json({ bills });
  } catch (error) {
    console.error('Get recurring bills error:', error);
    res.status(500).json({ error: 'Failed to fetch recurring bills' });
  }
};
