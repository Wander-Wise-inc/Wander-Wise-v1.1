// src/lib/utils.js
import { clsx } from "clsx"; // For combining class names conditionally
import { twMerge } from "tailwind-merge"; // For merging Tailwind CSS classes and resolving conflicts

/**
 * Combines and merges Tailwind CSS class names.
 * Useful for conditionally applying styles and avoiding class conflicts.
 * @param {...(string|Object|Array<string|Object>)} inputs - Class names or objects with class names as keys and boolean values.
 * @returns {string} A string of combined and merged class names.
 *
 * @example
 * cn("p-4", "m-2", { "bg-red-500": hasError, "text-white": isActive });
 * // => "p-4 m-2 bg-red-500 text-white" (if hasError and isActive are true)
 *
 * cn("px-2 py-1 bg-red hover:bg-dark-red", "p-3 bg-[#B91C1C]")
 * // => "p-3 bg-[#B91C1C] hover:bg-dark-red" (tailwind-merge resolves conflicts)
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Simple debounce function.
 * Delays the execution of a function until after a certain amount of time has passed since the last time it was invoked.
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {Function} A debounced version of the function.
 */
export function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/**
 * Formats a date object or string into a more readable format.
 * @param {Date|string} dateInput - The date to format.
 * @param {object} options - Intl.DateTimeFormat options.
 * @returns {string} The formatted date string.
 */
export const formatDate = (dateInput, options = { year: 'numeric', month: 'long', day: 'numeric' }) => {
  try {
    const date = new Date(dateInput);
    return new Intl.DateTimeFormat('en-IN', options).format(date);
  } catch (error) {
    console.error("Error formatting date:", dateInput, error);
    return "Invalid Date";
  }
};

/**
 * Capitalizes the first letter of a string.
 * @param {string} str - The string to capitalize.
 * @returns {string} The capitalized string.
 */
export const capitalizeFirstLetter = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
