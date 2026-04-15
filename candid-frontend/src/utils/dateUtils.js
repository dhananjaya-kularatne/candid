/**
 * Formats a date string into a relative "time ago" string.
 * Handles cases where the current system time might be slightly behind the server time.
 * 
 * @param {string|Date|number} dateStr - The date to format
 * @param {Object} options - Options for formatting
 * @param {boolean} options.short - If true, returns shorter strings (e.g., "5m" instead of "5m ago")
 * @returns {string} The formatted time ago string
 */
export function timeAgo(dateStr, options = { short: false }) {
  if (!dateStr) return '';
  
  // Ensure we have a valid date object
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  
  const diff = Date.now() - date.getTime();
  
  // Math.max(0, diff) handles negative diffs caused by clock drift (future dates)
  // We add a 2-second "future" allowance before we capping at 0
  const adjustedDiff = diff < -2000 ? 0 : diff;
  const seconds = Math.floor(Math.max(0, adjustedDiff) / 1000);
  const minutes = Math.floor(seconds / 60);
  
  const suffix = options.short ? '' : ' ago';
  
  // If post was in the future or within the last 30 seconds, show just now
  if (seconds < 30) return options.short ? 'just now' : 'Just now';
  
  if (minutes < 60) {
    return `${minutes}m${suffix}`;
  }
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h${suffix}`;
  }
  
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days}d${suffix}`;
  }
  
  // For older dates, return a formatted date e.g., "Oct 12"
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined 
  });
}

/**
 * Returns a consistent locale date string.
 * @param {string|Date|number} dateStr 
 * @returns {string}
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString();
}
