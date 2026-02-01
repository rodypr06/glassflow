import { body, param, validationResult } from 'express-validator';

// Validation middleware
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Auth validators
export const registerValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').trim().notEmpty().withMessage('Name is required')
];

export const loginValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Subscription validators
export const subscriptionValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('service').trim().notEmpty().withMessage('Service is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('billing_cycle').isIn(['monthly', 'quarterly', 'annual']).withMessage('Invalid billing cycle'),
  body('next_due_date').isISO8601().withMessage('Valid due date is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('active').optional().isBoolean().withMessage('Active must be a boolean')
];

export const updateSubscriptionValidator = [
  body('name').optional().trim().notEmpty(),
  body('service').optional().trim().notEmpty(),
  body('amount').optional().isFloat({ min: 0 }),
  body('billing_cycle').optional().isIn(['monthly', 'quarterly', 'annual']),
  body('next_due_date').optional().isISO8601(),
  body('category').optional().trim().notEmpty(),
  body('active').optional().isBoolean()
];

// Membership validators
export const membershipValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('provider').trim().notEmpty().withMessage('Provider is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('renewal_date').isISO8601().withMessage('Valid renewal date is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('notes').optional().trim()
];

export const updateMembershipValidator = [
  body('name').optional().trim().notEmpty(),
  body('provider').optional().trim().notEmpty(),
  body('amount').optional().isFloat({ min: 0 }),
  body('renewal_date').optional().isISO8601(),
  body('category').optional().trim().notEmpty(),
  body('notes').optional().trim()
];

// Bill validators
export const billValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('due_date').isISO8601().withMessage('Valid due date is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('status').optional().isIn(['pending', 'paid', 'overdue']).withMessage('Invalid status'),
  body('recurring').optional().isBoolean().withMessage('Recurring must be a boolean')
];

export const updateBillValidator = [
  body('name').optional().trim().notEmpty(),
  body('amount').optional().isFloat({ min: 0 }),
  body('due_date').optional().isISO8601(),
  body('category').optional().trim().notEmpty(),
  body('status').optional().isIn(['pending', 'paid', 'overdue']),
  body('recurring').optional().isBoolean()
];

// Credit Card validators
export const creditCardValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('bank').trim().notEmpty().withMessage('Bank is required'),
  body('last_4_digits').isLength({ min: 4, max: 4 }).withMessage('Last 4 digits must be 4 characters'),
  body('limit').isFloat({ min: 0 }).withMessage('Limit must be a positive number'),
  body('current_balance').optional().isFloat({ min: 0 }).withMessage('Current balance must be a positive number'),
  body('due_date').optional().isISO8601().withMessage('Valid due date is required'),
  body('interest_rate').optional().isFloat({ min: 0 }).withMessage('Interest rate must be a positive number'),
  body('color').optional().isHexColor().withMessage('Color must be a valid hex color')
];

export const updateCreditCardValidator = [
  body('name').optional().trim().notEmpty(),
  body('bank').optional().trim().notEmpty(),
  body('last_4_digits').optional().isLength({ min: 4, max: 4 }),
  body('limit').optional().isFloat({ min: 0 }),
  body('current_balance').optional().isFloat({ min: 0 }),
  body('due_date').optional().isISO8601(),
  body('interest_rate').optional().isFloat({ min: 0 }),
  body('color').optional().isHexColor()
];

// Loan validators
export const loanValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('lender').trim().notEmpty().withMessage('Lender is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('interest_rate').optional().isFloat({ min: 0 }).withMessage('Interest rate must be a positive number'),
  body('payment_amount').isFloat({ min: 0 }).withMessage('Payment amount must be a positive number'),
  body('remaining_balance').isFloat({ min: 0 }).withMessage('Remaining balance must be a positive number'),
  body('next_payment_date').isISO8601().withMessage('Valid payment date is required'),
  body('term_months').optional().isInt({ min: 1 }).withMessage('Term must be a positive integer'),
  body('paid_off').optional().isBoolean().withMessage('Paid off must be a boolean')
];

export const updateLoanValidator = [
  body('name').optional().trim().notEmpty(),
  body('lender').optional().trim().notEmpty(),
  body('amount').optional().isFloat({ min: 0 }),
  body('interest_rate').optional().isFloat({ min: 0 }),
  body('payment_amount').optional().isFloat({ min: 0 }),
  body('remaining_balance').optional().isFloat({ min: 0 }),
  body('next_payment_date').optional().isISO8601(),
  body('term_months').optional().isInt({ min: 1 }),
  body('paid_off').optional().isBoolean()
];

// Settings validators
export const settingsValidator = [
  body('theme').optional().isIn(['light', 'dark']).withMessage('Theme must be light or dark'),
  body('accent_color').optional().isHexColor().withMessage('Accent color must be a valid hex color'),
  body('notifications_enabled').optional().isBoolean().withMessage('Notifications enabled must be a boolean')
];

// ID parameter validator
export const idParamValidator = [
  param('id').isInt().withMessage('ID must be an integer')
];

// Date range validators for analytics
export const dateRangeValidator = [
  body('start_date').optional().isISO8601(),
  body('end_date').optional().isISO8601()
];
