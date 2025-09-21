// Performance monitoring for development
(function() {
    'use strict';

    const PerfMonitor = {
        start() {
            if (typeof performance === 'undefined') return;
            
            this.startTime = performance.now();
            this.loadedModules = [];
        },

        logModule(moduleName) {
            if (typeof performance === 'undefined') return;
            
            const loadTime = performance.now() - this.startTime;
            this.loadedModules.push({
                name: moduleName,
                loadTime: loadTime.toFixed(2)
            });
            
            console.log(`📦 Module loaded: ${moduleName} (${loadTime.toFixed(2)}ms)`);
        },

        logPageReady() {
            if (typeof performance === 'undefined') return;
            
            const totalTime = performance.now() - this.startTime;
            console.log(`🚀 Page ready in ${totalTime.toFixed(2)}ms`);
            console.log('📊 Loaded modules:', this.loadedModules);
        },

        logResourceTiming() {
            if (typeof performance === 'undefined' || !performance.getEntriesByType) return;
            
            const resources = performance.getEntriesByType('resource');
            const slowResources = resources.filter(r => r.duration > 100);
            
            if (slowResources.length > 0) {
                console.warn('⚠️ Slow loading resources:', slowResources.map(r => ({
                    name: r.name.split('/').pop(),
                    duration: r.duration.toFixed(2) + 'ms'
                })));
            }
        }
    };

    // Auto-start monitoring
    PerfMonitor.start();
    
    // Export for development use
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.PerfMonitor = PerfMonitor;
        
        // Log when page is fully loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                PerfMonitor.logPageReady();
                PerfMonitor.logResourceTiming();
            }, 100);
        });
    }
})();