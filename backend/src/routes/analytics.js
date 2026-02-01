import express from 'express';
import { dbGet, dbAll } from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get dashboard summary
router.get('/summary', async (req, res) => {
  try {
    // Get subscriptions summary
    const monthlySubscriptions = await dbGet(
      'SELECT SUM(CASE WHEN billing_cycle = "monthly" THEN cost WHEN billing_cycle = "yearly" THEN cost / 12 WHEN billing_cycle = "quarterly" THEN cost / 3 WHEN billing_cycle = "weekly" THEN cost * 4 ELSE 0 END) as total FROM subscriptions WHERE user_id = ?',
      [req.userId]
    );

    // Get memberships summary
    const memberships = await dbGet(
      'SELECT SUM(cost) as total FROM memberships WHERE user_id = ? AND status = "active"',
      [req.userId]
    );

    // Get credit cards summary
    const creditCards = await dbGet(
      'SELECT SUM(balance) as totalBalance, SUM(credit_limit) as totalLimit FROM credit_cards WHERE user_id = ?',
      [req.userId]
    );

    // Get loans summary
    const loans = await dbGet(
      'SELECT SUM(outstanding_amount) as total FROM loans WHERE user_id = ? AND status = "active"',
      [req.userId]
    );

    // Get upcoming bills (next 30 days)
    const upcomingBills = await dbAll(
      `SELECT SUM(amount) as total, COUNT(*) as count FROM bills 
       WHERE user_id = ? AND status != 'paid'
       AND date(due_date) BETWEEN date('now') AND date('now', '+30 days')`,
      [req.userId]
    );

    // Get unpaid bill count
    const unpaidBills = await dbGet(
      "SELECT COUNT(*) as count FROM bills WHERE user_id = ? AND status IN ('pending', 'overdue')",
      [req.userId]
    );

    const utilization = (creditCards.totalLimit && creditCards.totalLimit > 0)
      ? ((creditCards.totalBalance / creditCards.totalLimit) * 100).toFixed(2)
      : '0.00';

    res.json({
      monthlyExpenses: {
        subscriptions: monthlySubscriptions.total || 0,
        memberships: memberships.total || 0
      },
      debt: {
        creditCards: creditCards.totalBalance || 0,
        creditLimit: creditCards.totalLimit || 0,
        utilization: parseFloat(utilization),
        loans: loans.total || 0
      },
      bills: {
        upcoming: upcomingBills[0]?.total || 0,
        upcomingCount: upcomingBills[0]?.count || 0,
        unpaidCount: unpaidBills.count || 0
      }
    });
  } catch (error) {
    console.error('Get analytics summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get expense breakdown by category
router.get('/expenses/breakdown', async (req, res) => {
  try {
    // Get subscriptions by category
    const subscriptions = await dbAll(
      `SELECT category, SUM(cost) as total, COUNT(*) as count 
       FROM subscriptions 
       WHERE user_id = ? AND category IS NOT NULL
       GROUP BY category
       ORDER BY total DESC`,
      [req.userId]
    );

    // Get bills by category
    const bills = await dbAll(
      `SELECT category, SUM(amount) as total, COUNT(*) as count 
       FROM bills 
       WHERE user_id = ? AND category IS NOT NULL
       GROUP BY category
       ORDER BY total DESC`,
      [req.userId]
    );

    // Combine and group by category
    const breakdown = {};

    subscriptions.forEach(item => {
      const category = item.category || 'Other';
      if (!breakdown[category]) {
        breakdown[category] = { category, total: 0, count: 0 };
      }
      breakdown[category].total += item.total;
      breakdown[category].count += item.count;
    });

    bills.forEach(item => {
      const category = item.category || 'Other';
      if (!breakdown[category]) {
        breakdown[category] = { category, total: 0, count: 0 };
      }
      breakdown[category].total += item.total;
      breakdown[category].count += item.count;
    });

    const result = Object.values(breakdown).sort((a, b) => b.total - a.total);

    res.json({ breakdown: result });
  } catch (error) {
    console.error('Get expense breakdown error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get monthly trends
router.get('/trends', async (req, res) => {
  try {
    const { year } = req.query;
    const currentYear = year || new Date().getFullYear().toString();

    // Get bills paid each month
    const billsTrend = await dbAll(
      `SELECT 
        strftime('%m', date(paid_date)) as month,
        SUM(amount) as total
       FROM (
         SELECT *, updated_at as paid_date FROM bills 
         WHERE user_id = ? AND status = 'paid' AND strftime('%Y', updated_at) = ?
       )
       GROUP BY month
       ORDER BY month`,
      [req.userId, currentYear]
    );

    // Get subscription costs (monthly recurring)
    const subscriptionMonthly = await dbGet(
      'SELECT SUM(CASE WHEN billing_cycle = "monthly" THEN cost WHEN billing_cycle = "yearly" THEN cost / 12 WHEN billing_cycle = "quarterly" THEN cost / 3 WHEN billing_cycle = "weekly" THEN cost * 4 ELSE 0 END) as total FROM subscriptions WHERE user_id = ?',
      [req.userId]
    );

    // Fill in missing months
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = (i + 1).toString().padStart(2, '0');
      const found = billsTrend.find(t => t.month === month);
      return {
        month,
        bills: found?.total || 0,
        subscriptions: subscriptionMonthly.total || 0,
        total: (found?.total || 0) + (subscriptionMonthly.total || 0)
      };
    });

    res.json({ trends: monthlyData });
  } catch (error) {
    console.error('Get trends error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get subscription costs by cycle
router.get('/subscriptions/cycles', async (req, res) => {
  try {
    const result = await dbAll(
      `SELECT 
        billing_cycle,
        SUM(CASE WHEN billing_cycle = 'monthly' THEN cost WHEN billing_cycle = 'yearly' THEN cost / 12 WHEN billing_cycle = 'quarterly' THEN cost / 3 WHEN billing_cycle = 'weekly' THEN cost * 4 ELSE 0 END) as monthly_equivalent,
        SUM(cost) as total,
        COUNT(*) as count
       FROM subscriptions 
       WHERE user_id = ?
       GROUP BY billing_cycle
       ORDER BY monthly_equivalent DESC`,
      [req.userId]
    );

    res.json({ cycles: result });
  } catch (error) {
    console.error('Get subscription cycles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get membership types
router.get('/memberships/types', async (req, res) => {
  try {
    const result = await dbAll(
      `SELECT 
        type,
        SUM(cost) as total,
        COUNT(*) as count
       FROM memberships 
       WHERE user_id = ? AND type IS NOT NULL AND status = 'active'
       GROUP BY type
       ORDER BY total DESC`,
      [req.userId]
    );

    res.json({ types: result });
  } catch (error) {
    console.error('Get membership types error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get loan progress
router.get('/loans/progress', async (req, res) => {
  try {
    const loans = await dbAll(
      `SELECT 
        id,
        name,
        original_amount,
        outstanding_amount,
        ((original_amount - outstanding_amount) * 100.0 / original_amount) as progress,
        status
       FROM loans 
       WHERE user_id = ?
       ORDER BY progress DESC`,
      [req.userId]
    );

    const totalOriginal = loans.reduce((sum, l) => sum + l.original_amount, 0);
    const totalOutstanding = loans.reduce((sum, l) => sum + l.outstanding_amount, 0);
    const overallProgress = totalOriginal > 0 ? ((totalOriginal - totalOutstanding) / totalOriginal * 100).toFixed(2) : 0;

    res.json({
      loans: loans.map(l => ({
        ...l,
        progress: parseFloat(l.progress).toFixed(2)
      })),
      summary: {
        totalOriginal,
        totalOutstanding,
        overallProgress: parseFloat(overallProgress)
      }
    });
  } catch (error) {
    console.error('Get loan progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
