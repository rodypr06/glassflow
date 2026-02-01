/**
 * Email validator
 * @param {string} email - Email address to validate
 * @returns {Object} Validation result with isValid and error message
 */
export function validateEmail(email) {
  if (!email) {
    return { isValid: false, message: 'Email is required' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' }
  }

  return { isValid: true, message: '' }
}

/**
 * Password validator
 * @param {string} password - Password to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result with isValid, message, and requirements
 */
export function validatePassword(password, options = {}) {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumber = true,
    requireSpecialChar = false
  } = options

  const errors = []

  if (!password) {
    return { isValid: false, message: 'Password is required' }
  }

  if (password.length < minLength) {
    errors.push(`at least ${minLength} characters`)
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('an uppercase letter')
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('a lowercase letter')
  }

  if (requireNumber && !/\d/.test(password)) {
    errors.push('a number')
  }

  if (requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('a special character')
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      message: `Password must contain ${errors.join(', ')}`,
      errors
    }
  }

  return { isValid: true, message: '' }
}

/**
 * Required field validator
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} Validation result with isValid and error message
 */
export function validateRequired(value, fieldName = 'This field') {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, message: `${fieldName} is required` }
  }

  if (typeof value === 'string' && value.trim() === '') {
    return { isValid: false, message: `${fieldName} is required` }
  }

  return { isValid: true, message: '' }
}

/**
 * Date validator
 * @param {string|Date} date - Date to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result with isValid and error message
 */
export function validateDate(date, options = {}) {
  const { minDate, maxDate, required = false } = options

  if (required && !date) {
    return { isValid: false, message: 'Date is required' }
  }

  if (!date) {
    return { isValid: true, message: '' }
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (isNaN(dateObj.getTime())) {
    return { isValid: false, message: 'Please enter a valid date' }
  }

  if (minDate && dateObj < new Date(minDate)) {
    return { isValid: false, message: `Date must be after ${formatDate(minDate)}` }
  }

  if (maxDate && dateObj > new Date(maxDate)) {
    return { isValid: false, message: `Date must be before ${formatDate(maxDate)}` }
  }

  return { isValid: true, message: '' }
}

/**
 * Number validator
 * @param {number} value - Number to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result with isValid and error message
 */
export function validateNumber(value, options = {}) {
  const { min, max, required = false } = options

  if (required && (value === null || value === undefined || value === '')) {
    return { isValid: false, message: 'This field is required' }
  }

  if (value === null || value === undefined || value === '') {
    return { isValid: true, message: '' }
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(numValue)) {
    return { isValid: false, message: 'Please enter a valid number' }
  }

  if (min !== undefined && numValue < min) {
    return { isValid: false, message: `Value must be at least ${min}` }
  }

  if (max !== undefined && numValue > max) {
    return { isValid: false, message: `Value must be at most ${max}` }
  }

  return { isValid: true, message: '' }
}

/**
 * Credit card number validator
 * @param {string} cardNumber - Card number to validate
 * @returns {Object} Validation result with isValid and error message
 */
export function validateCardNumber(cardNumber) {
  if (!cardNumber) {
    return { isValid: false, message: 'Card number is required' }
  }

  const cleaned = cardNumber.replace(/\D/g, '')

  if (cleaned.length < 13 || cleaned.length > 19) {
    return { isValid: false, message: 'Please enter a valid card number' }
  }

  // Luhn algorithm for card validation
  let sum = 0
  let isEven = false

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10)

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  if (sum % 10 !== 0) {
    return { isValid: false, message: 'Please enter a valid card number' }
  }

  return { isValid: true, message: '' }
}

/**
 * Credit card CVV validator
 * @param {string} cvv - CVV to validate
 * @returns {Object} Validation result with isValid and error message
 */
export function validateCVV(cvv) {
  if (!cvv) {
    return { isValid: false, message: 'CVV is required' }
  }

  const cleaned = cvv.replace(/\D/g, '')

  if (cleaned.length < 3 || cleaned.length > 4) {
    return { isValid: false, message: 'CVV must be 3 or 4 digits' }
  }

  return { isValid: true, message: '' }
}

/**
 * Phone number validator
 * @param {string} phone - Phone number to validate
 * @returns {Object} Validation result with isValid and error message
 */
export function validatePhone(phone) {
  if (!phone) {
    return { isValid: false, message: 'Phone number is required' }
  }

  const cleaned = phone.replace(/\D/g, '')

  if (cleaned.length < 10) {
    return { isValid: false, message: 'Please enter a valid phone number' }
  }

  return { isValid: true, message: '' }
}

/**
 * URL validator
 * @param {string} url - URL to validate
 * @returns {Object} Validation result with isValid and error message
 */
export function validateURL(url) {
  if (!url) {
    return { isValid: true, message: '' }
  }

  try {
    new URL(url)
    return { isValid: true, message: '' }
  } catch (e) {
    return { isValid: false, message: 'Please enter a valid URL' }
  }
}

/**
 * Zip code validator (US format)
 * @param {string} zip - Zip code to validate
 * @returns {Object} Validation result with isValid and error message
 */
export function validateZipCode(zip) {
  if (!zip) {
    return { isValid: false, message: 'Zip code is required' }
  }

  const zipRegex = /^\d{5}(-\d{4})?$/
  if (!zipRegex.test(zip)) {
    return { isValid: false, message: 'Please enter a valid zip code' }
  }

  return { isValid: true, message: '' }
}

/**
 * Confirm password validator
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {Object} Validation result with isValid and error message
 */
export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) {
    return { isValid: false, message: 'Please confirm your password' }
  }

  if (password !== confirmPassword) {
    return { isValid: false, message: 'Passwords do not match' }
  }

  return { isValid: true, message: '' }
}

// Helper function for date formatting in validator
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
