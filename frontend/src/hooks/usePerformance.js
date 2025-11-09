import { useEffect, useRef, useCallback, useMemo } from 'react';
import { debounce, throttle, memoizeWithTTL } from '../utils/performance.js';

// Hook for debounced values
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook for throttled functions
export const useThrottle = (callback, delay) => {
  const throttledCallback = useMemo(
    () => throttle(callback, delay),
    [callback, delay]
  );

  return throttledCallback;
};

// Hook for intersection observer (lazy loading)
export const useIntersectionObserver = (options) => {
  const [entry, setEntry] = useState(null);
  const [node, setNode] = useState(null);

  const observer = useRef(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new window.IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setEntry(entry);
        if (options.triggerOnce) {
          observer.current.disconnect();
        }
      }
    }, options);

    const { current: currentObserver } = observer;

    if (node) currentObserver.observe(node);

    return () => currentObserver.disconnect();
  }, [node, options, options.triggerOnce]);

  return [setNode, entry];
};

// Hook for measuring component render time
export const useRenderTime = (componentName) => {
  const startTime = useRef(performance.now());

  useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} rendered in ${renderTime.toFixed(2)}ms`);
    }
  });
};

// Hook for memoized expensive calculations
export const useMemoWithTTL = (factory, dependencies, ttl = 300000) => {
  const memoizedFactory = useMemo(
    () => memoizeWithTTL(factory, ttl),
    [factory, ttl]
  );

  return useMemo(() => memoizedFactory(), dependencies);
};

// Hook for window size with debouncing
export const useWindowSize = (delay = 250) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = useDebounce(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, delay);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return windowSize;
};

// Hook for online/offline status
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

// Hook for network information
export const useNetworkInfo = () => {
  const [networkInfo, setNetworkInfo] = useState({
    effectiveType: '4g',
    downlink: 10,
    rtt: 50,
    saveData: false,
  });

  useEffect(() => {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      const updateNetworkInfo = () => {
        setNetworkInfo({
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData,
        });
      };

      updateNetworkInfo();
      connection.addEventListener('change', updateNetworkInfo);

      return () => {
        connection.removeEventListener('change', updateNetworkInfo);
      };
    }
  }, []);

  return networkInfo;
};

// Hook for lazy loading images
export const useLazyLoadImage = (src, placeholder) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageRef, inView] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImageSrc(src);
      };
    }
  }, [inView, src]);

  return [imageRef, imageSrc];
};

// Hook for virtual scrolling
export const useVirtualScroll = (items, itemHeight, containerHeight) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 50 });
  const scrollTop = useRef(0);

  const totalHeight = items.length * itemHeight;
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const buffer = 10;

  const handleScroll = useThrottle((e) => {
    const newScrollTop = e.target.scrollTop;
    scrollTop.current = newScrollTop;

    const start = Math.floor(newScrollTop / itemHeight) - buffer;
    const end = start + visibleCount + buffer * 2;

    setVisibleRange({
      start: Math.max(0, start),
      end: Math.min(items.length, end),
    });
  }, 16);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end);
  }, [items, visibleRange]);

  return {
    visibleItems,
    totalHeight,
    offsetTop: visibleRange.start * itemHeight,
    handleScroll,
  };
};

// Hook for measuring element size
export const useElementSize = (ref) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return size;
};

// Hook for request animation frame
export const useAnimationFrame = (callback, isRunning = true) => {
  const requestRef = useRef();
  const previousTimeRef = useRef();

  const animate = useCallback((time) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [callback, isRunning]);

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(requestRef.current);
    }
  }, [animate, isRunning]);
};

// Hook for performance monitoring
export const usePerformanceMonitor = (componentName) => {
  const startTime = useRef(performance.now());
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;

    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} - Render #${renderCount.current}: ${renderTime.toFixed(2)}ms`);
    }

    startTime.current = endTime;
  });

  return renderCount.current;
};

// Hook for idle callback execution
export const useIdleCallback = (callback, options = { timeout: 1000 }) => {
  useEffect(() => {
    let id;
    
    if ('requestIdleCallback' in window) {
      id = requestIdleCallback(callback, options);
    } else {
      id = setTimeout(callback, 0);
    }

    return () => {
      if ('cancelIdleCallback' in window) {
        cancelIdleCallback(id);
      } else {
        clearTimeout(id);
      }
    };
  }, [callback, options]);
};

// Import React hooks
import { useState, useEffect } from 'react';