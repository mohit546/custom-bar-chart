(function(root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['angular'], factory);
    } else if (typeof module !== 'undefined' && typeof module.exports === 'object') {
        module.exports = factory(require('angular'));
    } else {
        return factory(root.angular);
    }
}(this, function(angular) {
    'use strict';
    var chart = 'customBarChart';
    var mod = angular.module(chart, []);
    mod.value('customBarChart', { enabled: true });
    mod.directive('customBarChart', ['$log', 'customBarChart', function($log, customBarChart) {
        return function() {
            if (customBarChart.enabled) {
                $log.info('custom bar chart!', arguments);
            }
        }
    }]);

    return chart;
}));
