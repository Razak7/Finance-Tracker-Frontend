// client/src/utils/helpers.js
export const formatCurrency = (amount) => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    amount = 0;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const getMonthRange = (date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { start, end };
};

export const getMonthName = (date) => {
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

export const getShortMonthName = (date) => {
  return date.toLocaleString('default', { month: 'short' });
};

export const formatDate = (date, format = 'MMM d, yyyy') => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const getDaysInMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const calculateTotal = (items) => {
  return items.reduce((total, item) => total + (item.amount || 0), 0);
};

export const groupByCategory = (expenses) => {
  const categories = {};
  expenses.forEach(expense => {
    if (!categories[expense.category]) {
      categories[expense.category] = 0;
    }
    categories[expense.category] += expense.amount;
  });
  return categories;
};

export const getTopCategory = (expenses) => {
  const categories = groupByCategory(expenses);
  const entries = Object.entries(categories);
  if (entries.length === 0) return null;
  return entries.sort((a, b) => b[1] - a[1])[0];
};