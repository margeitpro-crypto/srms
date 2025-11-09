// Performance optimization utilities

// Lazy loading for images
export const lazyLoadImages = () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
};

// Debounce function for performance optimization
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// Throttle function for scroll and resize events
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Virtual scrolling for large lists
export const createVirtualScroller = (container, items, itemHeight, renderItem) => {
  const totalHeight = items.length * itemHeight;
  const visibleCount = Math.ceil(container.clientHeight / itemHeight);
  const buffer = 5;
  
  let startIndex = 0;
  let endIndex = visibleCount + buffer;

  const render = () => {
    const fragment = document.createDocumentFragment();
    
    for (let i = startIndex; i < endIndex && i < items.length; i++) {
      const itemElement = renderItem(items[i], i);
      itemElement.style.position = 'absolute';
      itemElement.style.top = `${i * itemHeight}px`;
      itemElement.style.height = `${itemHeight}px`;
      fragment.appendChild(itemElement);
    }
    
    container.innerHTML = '';
    container.appendChild(fragment);
    container.style.height = `${totalHeight}px`;
  };

  const onScroll = () => {
    const scrollTop = container.scrollTop;
    const newStartIndex = Math.floor(scrollTop / itemHeight) - buffer;
    const newEndIndex = newStartIndex + visibleCount + buffer * 2;

    if (newStartIndex !== startIndex || newEndIndex !== endIndex) {
      startIndex = Math.max(0, newStartIndex);
      endIndex = Math.min(items.length, newEndIndex);
      render();
    }
  };

  container.addEventListener('scroll', throttle(onScroll, 16));
  render();

  return {
    update: (newItems) => {
      items = newItems;
      render();
    },
    destroy: () => {
      container.removeEventListener('scroll', onScroll);
    }
  };
};

// Memory leak prevention
export const cleanupEventListeners = (element, events) => {
  events.forEach(({ event, handler }) => {
    element.removeEventListener(event, handler);
  });
};

// Optimize re-renders in React components
export const shouldComponentUpdate = (prevProps, nextProps, keys) => {
  return keys.some(key => prevProps[key] !== nextProps[key]);
};

// Cache API responses
const apiCache = new Map();

export const cachedFetch = async (url, options = {}) => {
  const cacheKey = `${url}-${JSON.stringify(options)}`;
  const cached = apiCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutes cache
    return cached.data;
  }

  const response = await fetch(url, options);
  const data = await response.json();
  
  apiCache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });

  return data;
};

// Clear API cache
export const clearApiCache = () => {
  apiCache.clear();
};

// Preload critical resources
export const preloadResources = (resources) => {
  resources.forEach(resource => {
    if (resource.type === 'image') {
      const img = new Image();
      img.src = resource.src;
    } else if (resource.type === 'script') {
      const script = document.createElement('script');
      script.src = resource.src;
      script.async = true;
      document.head.appendChild(script);
    } else if (resource.type === 'style') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = resource.href;
      document.head.appendChild(link);
    }
  });
};

// Monitor performance metrics
export const monitorPerformance = () => {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          console.log('Navigation timing:', {
            domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
            loadComplete: entry.loadEventEnd - entry.loadEventStart,
            totalTime: entry.loadEventEnd - entry.navigationStart
          });
        }
        
        if (entry.entryType === 'resource') {
          console.log(`Resource ${entry.name} loaded in ${entry.duration}ms`);
        }
      }
    });

    observer.observe({ entryTypes: ['navigation', 'resource'] });
  }
};

// Optimize images
export const optimizeImage = (file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: 'image/jpeg' }));
        }, 'image/jpeg', quality);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

// Advanced memoization with TTL
export const memoizeWithTTL = (fn, ttl = 300000) => { // 5 minutes default
  const cache = new Map();
  
  return function (...args) {
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }
    
    const result = fn.apply(this, args);
    cache.set(key, {
      data: result,
      timestamp: Date.now()
    });
    
    return result;
  };
};

// Progressive image loading
export const progressiveImageLoader = (src, placeholder) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = placeholder;
    
    const highResImg = new Image();
    highResImg.onload = () => {
      resolve(highResImg.src);
    };
    highResImg.onerror = reject;
    highResImg.src = src;
  });
};

// Resource hints for performance
export const addResourceHints = (resources) => {
  resources.forEach(resource => {
    const link = document.createElement('link');
    
    switch (resource.type) {
      case 'dns-prefetch':
        link.rel = 'dns-prefetch';
        link.href = resource.href;
        break;
      case 'preconnect':
        link.rel = 'preconnect';
        link.href = resource.href;
        break;
      case 'prefetch':
        link.rel = 'prefetch';
        link.href = resource.href;
        break;
      case 'preload':
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        break;
    }
    
    document.head.appendChild(link);
  });
};

// Performance observer for Core Web Vitals
export const observeCoreWebVitals = () => {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime);
        }
        if (entry.entryType === 'first-input') {
          console.log('FID:', entry.processingStart - entry.startTime);
        }
        if (entry.entryType === 'layout-shift') {
          console.log('CLS:', entry.value);
        }
      }
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
  }
};

// Connection-aware loading
export const getConnectionInfo = () => {
  if ('connection' in navigator) {
    const connection = navigator.connection;
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    };
  }
  return null;
};

// Adaptive loading based on connection
export const adaptiveLoad = (resources) => {
  const connection = getConnectionInfo();
  
  if (!connection) return resources;
  
  if (connection.saveData || connection.effectiveType === '2g') {
    return resources.filter(r => r.priority === 'high');
  }
  
  if (connection.effectiveType === '3g') {
    return resources.filter(r => r.priority !== 'low');
  }
  
  return resources;
};

// Idle callback execution
export const executeOnIdle = (callback, timeout = 1000) => {
  if ('requestIdleCallback' in window) {
    return requestIdleCallback(callback, { timeout });
  } else {
    return setTimeout(callback, 0);
  }
};

// Web Workers for heavy computations
export const createWorker = (workerFunction) => {
  const workerCode = `
    self.onmessage = function(e) {
      const result = (${workerFunction.toString()})(e.data);
      self.postMessage(result);
    };
  `;
  
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  const worker = new Worker(URL.createObjectURL(blob));
  
  return {
    execute: (data) => {
      return new Promise((resolve) => {
        worker.onmessage = (e) => resolve(e.data);
        worker.postMessage(data);
      });
    },
    terminate: () => worker.terminate()
  };
};