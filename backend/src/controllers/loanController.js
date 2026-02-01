import Loan from '../models/Loan.js';

// Get all loans for user
export const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll(req.user.id);
    res.json({ loans });
  } catch (error) {
    console.error('Get loans error:', error);
    res.status(500).json({ error: 'Failed to fetch loans' });
  }
};

// Get single loan
export const getLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const loan = await Loan.findById(id, req.user.id);

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    res.json({ loan });
  } catch (error) {
    console.error('Get loan error:', error);
    res.status(500).json({ error: 'Failed to fetch loan' });
  }
};

// Create loan
export const createLoan = async (req, res) => {
  try {
    const loanData = {
      ...req.body,
      user_id: req.user.id
    };
    const loan = await Loan.create(loanData);
    res.status(201).json({ message: 'Loan created', loan });
  } catch (error) {
    console.error('Create loan error:', error);
    res.status(500).json({ error: 'Failed to create loan' });
  }
};

// Update loan
export const updateLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const loan = await Loan.update(id, req.user.id, req.body);

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    res.json({ message: 'Loan updated', loan });
  } catch (error) {
    console.error('Update loan error:', error);
    res.status(500).json({ error: 'Failed to update loan' });
  }
};

// Delete loan
export const deleteLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Loan.delete(id, req.user.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    res.json({ message: 'Loan deleted successfully' });
  } catch (error) {
    console.error('Delete loan error:', error);
    res.status(500).json({ error: 'Failed to delete loan' });
  }
};

// Get active loans
export const getActiveLoans = async (req, res) => {
  try {
    const loans = await Loan.findActive(req.user.id);
    res.json({ loans });
  } catch (error) {
    console.error('Get active loans error:', error);
    res.status(500).json({ error: 'Failed to fetch active loans' });
  }
};

// Get paid off loans
export const getPaidOffLoans = async (req, res) => {
  try {
    const loans = await Loan.findPaidOff(req.user.id);
    res.json({ loans });
  } catch (error) {
    console.error('Get paid off loans error:', error);
    res.status(500).json({ error: 'Failed to fetch paid off loans' });
  }
};

// Get loans with upcoming payments
export const getUpcomingLoanPayments = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const loans = await Loan.findUpcomingPayments(req.user.id, days);
    res.json({ loans });
  } catch (error) {
    console.error('Get upcoming payments error:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming loan payments' });
  }
};
