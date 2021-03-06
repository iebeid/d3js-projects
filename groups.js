/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var width = 1024,
                    height = 1024;
            var div = d3.select('#chart');
            var svg = div.append('svg')
                    .attr('width', width)
                    .attr('height', height);
            svg.append("rect")
                    .attr("style", "fill: #eee")
                    .attr("width", width)
                    .attr("height", height);

            d3.json("interaction.json", handleJsonData);

            function handleJsonData(elements) {
                var data = [];
                var columnWidths = [];
                var rowHeights = [];
                var padding = 10;
                var nRect = elements.nodes.length;
                var relSize = 10;
                var rectWidth = ((width - (nRect - 1) * relSize) / nRect);
                var rw = rectWidth;
                var translationMargin = rectWidth + padding;
                var columnHeaders = [];
                var rowHeaders = [];
                var seqOneCount = 0;
                var seqTwoCount = 0;
                elements.nodes.forEach(function (node) {
                    if (node.type == 1) {

                        columnHeaders[seqOneCount] = node.name;
                        seqOneCount++;
                    }
                    if (node.type == 2) {

                        rowHeaders[seqTwoCount] = node.name;
                        seqTwoCount++;
                    }
                });
                //Corner Stone
                var cornerGroup = svg.append('g');
                var corner = cornerGroup.append('rect').attr('width', rw).attr('height', rw).style('fill', 'none');

                //Group for column headers
                var columnGroup = svg.append('g');
                var column = columnGroup.selectAll('g').data(columnHeaders).enter().append('rect').attr('x', function (d, i) {
                    return translationMargin * i;
                })
                        .attr('width', function (d, i) {
                            //console.log(d);
                            var w = d.length * 10;
                            columnWidths[i] = w;
                            //console.log(columnWidths[i]);
                            return w;
                        }).attr('rx', '5')
                        .attr('ry', '5')
                        .style('fill', 'red').attr('height', rw).attr('transform', function (d, i) {
                    return 'translate(' + translationMargin + ',0)';
                });

                var textColumn = columnGroup.selectAll('g').data(columnHeaders).enter().append('text').attr('fill', 'black').attr('font-size', '25')
                        .attr('x', function (d, i) {
                            return translationMargin * i;
                        })
                        .attr('y', function () {
                            return rw / 2
                        }).text(function (d) {
                    return d;
                }).attr('transform', function (d, i) {
                    return 'translate(' + translationMargin + ',0)';
                });

                //Group for row headers        
                var rowGroup = svg.append('g');
                var row = rowGroup.selectAll('g').data(rowHeaders).enter().append('rect').attr('x', function (d, i) {
                    return translationMargin * i;
                })
                        .attr('width', function (d, i) {
                            //console.log(parseInt(d.length));
                            var w = d.length * 10;
                            rowHeights[i] = w;

                            return w;
                        }).attr('rx', '2')
                        .attr('ry', '2')
                        .style('fill', 'blue').attr('height', rw)
                        .attr('transform', function (d, i) {
                            return 'translate(' + rw + ',' + translationMargin + ')rotate(90)';
                        });
                var textRow = rowGroup.selectAll('g').data(rowHeaders).enter().append('text').attr('fill', 'black').attr('font-size', '25').attr('x', function (d, i) {
                    return translationMargin * i;
                }).attr('y', function () {
                    return rw / 2
                }).text(function (d) {
                    return d;
                }).attr('transform', function (d, i) {
                    return 'translate(' + rw + ',' + translationMargin + ')rotate(90)';
                });

                //Group for data
                elements.nodes.forEach(function (node, i) {
                    node.index = i;
                    data[i] = d3.range(elements.nodes.length).map(function (j) {
                        return {x: j, y: i, z: 0, target: node.name, source: "", w: columnWidths[j], h: rowHeights[i]};
                    });
                });
                var dataGroup = svg.append('g');
                var grp = dataGroup.selectAll('g')
                        .data(data)
                        .enter()
                        .append('g')
                        .attr('transform', function (d, i) {
                            return 'translate(0, ' + translationMargin * i + ')translate(' + translationMargin + ',' + translationMargin + ')';
                        });
                grp.selectAll('rect')
                        .data(function (d) {
                            return d;
                        })
                        .enter()
                        .append('rect').attr('rx', '2')
                        .attr('ry', '2')
                        .attr('x', function (d, i) {
                            return translationMargin * i;
                        })
                        .attr('width', function (d, i) {
                            return d.w;
                        })
                        .attr('height', function (d, i) {
                            return d.h;
                        }).append("title").text(function (d, i) {
                    return "Source: " + d.x + " \nTarget: " + d.y + " \nValue: " + d.z + " \nSourceSequence: " + d.source + " \nTargetSequence: " + d.target;
                });
            }