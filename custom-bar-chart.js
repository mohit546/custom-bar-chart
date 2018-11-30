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
    mod.value('customBarChartOptions', { enabled: true });
    mod.directive('customBarChartInitiated', ['$log', 'customBarChartOptions', function($log, customBarChartOptions) {
        return function() {
            if (customBarChartOptions.enabled) {
                $log.info('custom bar chart!', arguments);
            }
        }
    }]);

    return chart;
}));
