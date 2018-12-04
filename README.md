# custom-bar-chart
basic chart library

# Installation
## Install

    $ npm install https://github.com/mohit546/custom-bar-chart.git

# Example

## Markup

```html
<script src="node_modules/custom-bar-chart/custom-bar-chart.js"></script>
<custom-bar-chart height="500" width="500" labels="label" values="data" legend="legend" gridscale="gridScale" seriesname="seriesName"></custom-bar-chart>
```

## Javascript

```javascript
angular.module('app', ['customBarChart'])
.controller('customBarchartCtrl', function($scope) {
    $scope.label = ['music', 'rock', 'Pop', 'Jazz', 'folk', 'country', 'heavy', 'metal'];
    $scope.data = [10, 14, 2, 12, 11, 13, 15, 200];
    $scope.legend = false;
    $scope.gridScale = 10;
    $scope.seriesName = "Demo Chart";
});
```
