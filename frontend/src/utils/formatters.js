/**
 * Currency formatter - formats amount as USD with 2 decimal places
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = 'USD') {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '$0.00'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

/**
 * Date formatter - formats date to readable format
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type: 'short', 'long', 'time', 'full'
 * @returns {string} Formatted date string
 */
export function formatDate(date, format = 'short') {
  if (!date) return ''

  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (isNaN(dateObj.getTime())) return ''

  const options = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
    time: { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' },
    full: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' },
    monthYear: { month: 'long', year: 'numeric' },
    monthShort: { month: 'short', year: '2-digit' }
  }

  return new Intl.DateTimeFormat('en-US', options[format] || options.short).format(dateObj)
}

/**
 * Percentage formatter
 * @param {number} value - Value to format as percentage
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted percentage string
 */
export function formatPercent(value, decimals = 1) {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0%'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100)
}

/**
 * Number formatter - adds commas to large numbers
 * @param {number} num - Number to format
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted number string
 */
export function formatNumber(num, decimals = 0) {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0'
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num)
}

/**
 * Relative time formatter - formats date as relative time (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export function formatRelativeTime(date) {
  if (!date) return ''

  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (isNaN(dateObj.getTime())) return ''

  const now = new Date()
  const diffMs = now - dateObj
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) {
    return 'just now'
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  } else {
    return formatDate(date, 'short')
  }
}

/**
 * Abbreviate large numbers (e.g., 1.5K, 2.3M)
 * @param {number} num - Number to abbreviate
 * @returns {string} Abbreviated number
 */
export function abbreviateNumber(num) {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0'
  }

  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B'
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }

  return num.toString()
}

/**
 * Format credit card number with spaces (e.g., "1234 5678 9012 3456")
 * @param {string} cardNumber - Card number to format
 * @returns {string} Formatted card number
 */
export function formatCardNumber(cardNumber) {
  if (!cardNumber) return ''
  const cleaned = cardNumber.replace(/\D/g, '')
  const groups = cleaned.match(/.{1,4}/g) || []
  return groups.join(' ').substr(0, 19)
}

/**
 * Format credit card expiry (MM/YY)
 * @param {string} expiry - Expiry string
 * @returns {string} Formatted expiry
 */
export function formatCardExpiry(expiry) {
  if (!expiry) return ''
  const cleaned = expiry.replace(/\D/g, '')
  if (cleaned.length >= 2) {
    return cleaned.substr(0, 2) + '/' + cleaned.substr(2, 2)
  }
  return cleaned
}
