import React, { useState, useEffect } from 'react';

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    pageLoadTime: 0,
    apiResponseTime: 0,
    memoryUsage: 0,
    networkRequests: 0,
  });
  
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Measure page load time
    const navigationStart = performance.timing.navigationStart;
    const loadEventEnd = performance.timing.loadEventEnd;
    const pageLoadTime = loadEventEnd - navigationStart;

    // Monitor API response times
    const originalFetch = window.fetch;
    let totalResponseTime = 0;
    let requestCount = 0;

    window.fetch = async (...args) => {
      const startTime = performance.now();
      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        totalResponseTime += responseTime;
        requestCount++;
        
        setMetrics(prev => ({
          ...prev,
          apiResponseTime: Math.round(totalResponseTime / requestCount),
          networkRequests: requestCount,
        }));
        
        return response;
      } catch (error) {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        totalResponseTime += responseTime;
        requestCount++;
        
        setMetrics(prev => ({
          ...prev,
          apiResponseTime: Math.round(totalResponseTime / requestCount),
          networkRequests: requestCount,
        }));
        
        throw error;
      }
    };

    // Monitor memory usage
    const updateMemoryUsage = () => {
      if (performance.memory) {
        setMetrics(prev => ({
          ...prev,
          memoryUsage: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        }));
      }
    };

    // Set initial metrics
    setMetrics(prev => ({
      ...prev,
      pageLoadTime,
    }));

    // Update memory usage periodically
    const memoryInterval = setInterval(updateMemoryUsage, 5000);

    return () => {
      window.fetch = originalFetch;
      clearInterval(memoryInterval);
    };
  }, []);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const getPerformanceGrade = () => {
    const { pageLoadTime, apiResponseTime } = metrics;
    if (pageLoadTime < 1000 && apiResponseTime < 200) return 'A';
    if (pageLoadTime < 2000 && apiResponseTime < 500) return 'B';
    if (pageLoadTime < 3000 && apiResponseTime < 1000) return 'C';
    return 'D';
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'text-green-600';
      case 'B': return 'text-yellow-600';
      case 'C': return 'text-orange-600';
      case 'D': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={toggleVisibility}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        title="Show Performance Monitor"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl p-4 w-80 z-50 border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Performance Monitor</h3>
        <button
          onClick={toggleVisibility}
          className="text-gray-500 hover:text-gray-700"
          title="Hide Performance Monitor"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Performance Grade:</span>
          <span className={`text-lg font-bold ${getGradeColor(getPerformanceGrade())}`}>
            {getPerformanceGrade()}
          </span>
        </div>

        <div className="border-t pt-3 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Page Load Time:</span>
            <span className="text-sm font-medium">{metrics.pageLoadTime}ms</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Avg API Response:</span>
            <span className="text-sm font-medium">{metrics.apiResponseTime}ms</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Memory Usage:</span>
            <span className="text-sm font-medium">{metrics.memoryUsage}MB</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Network Requests:</span>
            <span className="text-sm font-medium">{metrics.networkRequests}</span>
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="text-xs text-gray-500 space-y-1">
            <div>• Page load &lt; 1s: Excellent</div>
            <div>• API response &lt; 200ms: Good</div>
            <div>• Memory usage &lt; 100MB: Normal</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;