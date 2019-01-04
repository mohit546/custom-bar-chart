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
        return {
            restrict: "E",
            scope: {
                seriesname: "=",
                gridscale: "=",
                height: "=",
                width: "=",
                labels: "=",
                values: "=",
                legend: "=",
            },
            template: '<canvas id="myCanvas" style="background: white;"></canvas><legend for="myCanvas"></legend>',
            link: function(scope, element) {
                var myCanvas = element[0].querySelector('canvas');
                myCanvas.width = scope.width;
                myCanvas.height = scope.height;
                var ctx = myCanvas.getContext('2d');
                var myBarchart = null;

                scope.$watch('legend', function (newValue, oldValue) {
                    defaultVal.legend = newValue;
                    myBarchart = null;
                    myBarchart = new Barchart(defaultVal);
                    myBarchart.draw();
                }, true);

                scope.$watchCollection('labels', function (newValue, oldValue) {
                    defaultVal.data.labels = newValue;
                    myBarchart = null;
                    myBarchart = new Barchart(defaultVal);
                    myBarchart.draw();
                }, true);

                scope.$watchCollection('values', function (newValue, oldValue) {
                    defaultVal.data.values = newValue;
                    myBarchart = null;
                    myBarchart = new Barchart(defaultVal);
                    myBarchart.draw();
                }, true);


                var defaultVal = {
                    canvas: myCanvas,
                    seriesName: scope.seriesname,
                    padding: 30,
                    gridScale: scope.gridscale,
                    gridColor: "#000000",
                    data: {
                        labels: scope.labels,
                        values: scope.values,
                    },
                    colors: ["#a55ca5", "#67b6c7", "#bccd7a", "#eb9743"],
                    legend: scope.legend
                };

                function drawLine(ctx, startX, startY, endX, endY, color) {
                    ctx.save();
                    ctx.strokeStyle = color;
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(endX, endY);
                    ctx.stroke();
                    ctx.restore();
                }

                function drawBar(ctx, upperLeftCornerX, upperLeftCornerY, width, height, color) {
                    ctx.save();
                    ctx.fillStyle = color;
                    ctx.fillRect(upperLeftCornerX, upperLeftCornerY, width, height);
                    ctx.restore();
                }

                function drawAxis(x, y, X, Y) {
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(X, Y);
                    ctx.closePath();
                    ctx.stroke();
                }

                var Barchart = function(options) {
                    this.options = options;
                    this.canvas = options.canvas;
                    this.ctx = this.canvas.getContext("2d");
                    this.colors = options.colors;

                    var bMargin = 0,
                        cMargin = 0,
                        cSpace = 0,
                        totalBars = this.options.data.values.length,
                        cHeight = this.canvas.height - this.options.padding - 2 * cMargin - cSpace,
                        cWidth = this.canvas.width - this.options.padding - 2 * cMargin - cSpace,
                        cMarginSpace = cMargin + cSpace,
                        cMarginHeight = cMargin + cHeight,
                        bWidth = (cWidth / totalBars) - bMargin;

                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);


                    this.draw = function() {
                        drawAxis(this.options.padding, 0, this.options.padding, this.canvas.height - this.options.padding);
                        drawAxis(this.options.padding, this.canvas.height - this.options.padding, this.canvas.height - this.options.padding, this.canvas.height - this.options.padding);

                        for (var i = 0, l = this.options.data.labels.length; i < l; i++) {
                            var name = this.options.data.labels[i],
                                markerXPos = cMarginSpace + bMargin + (i * (bWidth + bMargin)) + (bWidth / 2),
                                markerYPos = cMarginHeight + 10;
                            this.ctx.fillText(name, markerXPos, markerYPos, bWidth);
                        }

                        var maxValue = 0;
                        for (var categ in this.options.data.values) {
                            maxValue = Math.max(maxValue, this.options.data.values[categ]);
                        }
                        var canvasActualHeight = this.canvas.height - this.options.padding * 2;
                        var canvasActualWidth = this.canvas.width - this.options.padding * 2;

                        var gridValue = 0;
                        while (gridValue <= maxValue) {
                            var gridY = canvasActualHeight * (1 - gridValue / maxValue) + this.options.padding;
                            drawLine(
                                this.ctx,
                                0,
                                gridY,
                                this.canvas.width,
                                gridY,
                                this.options.gridColor
                            );

                            this.ctx.save();
                            this.ctx.fillStyle = this.options.gridColor;
                            this.ctx.textBaseline = "bottom";
                            this.ctx.font = "bold 10px Arial";
                            this.ctx.fillText(gridValue, 3, gridY - 2);
                            this.ctx.restore();

                            gridValue += this.options.gridScale;
                        }

                        var barIndex = 0;
                        var numberOfBars = Object.keys(this.options.data.values).length;
                        var barSize = (canvasActualWidth) / numberOfBars;

                        for (categ in this.options.data.values) {
                            var val = this.options.data.values[categ];
                            var barHeight = Math.round(canvasActualHeight * val / maxValue);
                            drawBar(
                                this.ctx,
                                this.options.padding + barIndex * barSize,
                                this.canvas.height - barHeight - this.options.padding,
                                barSize,
                                barHeight,
                                this.colors[barIndex % this.colors.length]
                            );

                            barIndex++;
                        }

                        this.ctx.save();
                        this.ctx.textBaseline = "bottom";
                        this.ctx.textAlign = "center";
                        this.ctx.fillStyle = "#000000";
                        this.ctx.font = "bold 14px Arial";
                        this.ctx.fillText(this.options.seriesName, this.canvas.width / 2, this.canvas.height);
                        this.ctx.restore();

                        barIndex = 0;
                        var legend = document.querySelector("legend[for='myCanvas']");
                        if (legend.children.length) legend.innerHTML = '';
                        var ul = document.createElement("ul");
                        legend.append(ul);
                        for (let i = 0, l = this.options.data.labels.length; i < l; i++) {
                            var li = document.createElement("li"),
                            categ = this.options.data.labels[i];
                            li.style.listStyle = "none";
                            li.style.borderLeft = "20px solid " + this.colors[barIndex % this.colors.length];
                            li.style.padding = "5px";
                            li.textContent = categ;
                            ul.append(li);
                            barIndex++;
                        }
                        legend.style.display = "none";
                        if (this.options.legend) legend.style.display = "block";
                    }
                }
                myBarchart = new Barchart(defaultVal);
                myBarchart.draw();
            }
        };
    }]);

    return chart;
}));
