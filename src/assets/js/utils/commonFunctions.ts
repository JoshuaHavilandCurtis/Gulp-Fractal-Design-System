export function asyncDebounce(fn: any, wait: number) {
    let timeout: any;
  
    return function (...args: any) {
      const later = async () => {
        clearTimeout(timeout);
        await fn(...args);
      };
  
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  export function debounce(fn: any, wait: number) {
    let timeout: any;
  
    return function (...args: any) {
      const later = () => {
        clearTimeout(timeout);
        fn(...args);
      };
  
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  export function docReady(fn: () => void) {
    // see if DOM is already available
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      // call on next available tick
      setTimeout(fn, 1);
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }
  