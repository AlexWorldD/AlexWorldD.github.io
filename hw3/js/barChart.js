/** Class implementing the bar chart view. */
class BarChart {

    /**
     * Create a bar chart instance and pass the other views in.
     * @param worldMap
     * @param infoPanel
     * @param allData
     */
    constructor() {
        // this.worldMap = worldMap;
        // this.infoPanel = infoPanel;
        this.allData = window.allData;
        this.xScale;
        this.yScale;
        this.drawBarChart();
    }

    drawBarChart(selectedDimension) {
        // ******* TODO: PART I *******
        if (selectedDimension === undefined) {
            selectedDimension = d3.select('select#dataset').property("value");
        }

        let max = d3.max(this.allData, function (d) {
            return d[selectedDimension];
        });

        // space for the labels
        let textWidth = 70;
        // Getting required encoder of bars
        let svg = d3.select('svg#barChart'),
            padding = {top: 20, right: 10, bottom: 20, left: 20},
            margin = {top: 10, right: 5, bottom: 40, left: 60},
            height = +svg.attr("height"),
            width = +svg.attr("width");
        //svg.attr('height', height+25+'px');
        // d3.select(svg.node().parentNode)
        //     .attr('width', (width + padding.left + padding.right) + 'px')
        //     .attr('height', (height + padding.top + padding.bottom) + 'px');

        // Draw Y-Axis
        let yScale = d3.scaleLinear()
            .domain([0, max])
            .range([height - (margin.bottom + margin.top), margin.top])
            .nice();
        let yAxis = d3.axisLeft();
        switch (selectedDimension) {
            case 'attendance': {
                yAxis.ticks(10).tickFormat(d3.format(",.0f"));
                break;
            }
            case 'teams': {
                yAxis.ticks(7).tickFormat(d3.format(".0f"));
                break;
            }
            case 'goals': {
                yAxis.ticks(10).tickFormat(d3.format(".0f"));
                break;
            }
            case 'matches': {
                yAxis.ticks(7).tickFormat(d3.format(".0f"));
                break;
            }
        }
        yAxis.scale(yScale);

        // Draw X-Axis
        let xScale = d3.scaleBand()
            .range([0, width - margin.left - margin.right]).padding(.1)
            // Setting the domain for X scale: from first to last year
            .domain(this.allData.map(function (d) {
                return d.YEAR
            }));
        let xAxis = d3.axisBottom(xScale);

        svg.select('#yAxis')
            .attr("transform", "translate(" + margin.left + ',' + 0 + ")")
            .call(yAxis);

        svg.select('#xAxis')
            .attr('transform', 'translate(' + margin.left + ',' + (height - margin.top - margin.bottom) + ')')
            .call(xAxis)
            .selectAll('text')
            .style("text-anchor", "end")
            .attr("dx", "-15px")
            .attr("dy", "-5px")
            .attr("transform", "rotate(-90)");


        // Color scaling
        let colorScale = d3.scaleSequential(d3['interpolateBlues'])
            .domain([0, max]);

        //---------------- Enter and Enter Animations ------------------------
        svg.select('#bars').selectAll('rect.bar')
            .data(this.allData)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', function (d) {
                return (margin.left + xScale(d.year));
            })
            .attr('width', xScale.bandwidth())
            .attr("y", height - margin.top - margin.bottom) //setting y at the bottom for the transition effect
            .attr('height', 0)
            .transition().duration(3000)
            .attr('y', function (d) {
                return yScale(d[selectedDimension]);
            })
            .attr('height', function (d) {
                return height - margin.top - margin.bottom - yScale(d[selectedDimension]);
            })
            .style('fill', function (d) {
                return colorScale(d[selectedDimension])
            });
        svg.selectAll('rect.bar').on("click", this.selectCup);
        this.xScale = xScale;
        this.yScale = yScale;
        // let rnd = Math.floor(Math.random() * this.allData.length);
        // t.classed('selected', true)
        // ******* TODO: PART II *******

        // Implement how the bars respond to click events
        // Color the selected bar to indicate is has been selected.
        // Make sure only the selected bar has this new color.

        // Call the necessary update functions for when a user clicks on a bar.
        // Note: think about what you want to update when a different bar is selected.

    }
    update(selectedDimension) {

        if (selectedDimension === undefined) {
            selectedDimension = d3.select('select#dataset').property("value");
        }

        let max = d3.max(this.allData, function (d) {
            return d[selectedDimension];
        });

        // Getting required encoder of bars
        let svg = d3.select('div#bar-chart').select('svg#barChart'),
            margin = {top: 10, right: 5, bottom: 40, left: 60},
            height = +svg.attr("height");
        // Update Y-Axis
        let yScale = this.yScale
                    .domain([0, max]);
        let yAxis = d3.axisLeft();
        switch (selectedDimension) {
            case 'attendance': {
                yAxis.ticks(10).tickFormat(d3.format(",.0f"));
                break;
            }
            case 'teams': {
                yAxis.ticks(7).tickFormat(d3.format(".0f"));
                break;
            }
            case 'goals': {
                yAxis.ticks(10).tickFormat(d3.format(".0f"));
                break;
            }
            case 'matches': {
                yAxis.ticks(7).tickFormat(d3.format(".0f"));
                break;
            }
        }
        yAxis.scale(yScale);
        svg.select('#yAxis').transition().duration(2500)
            .attr("transform", "translate(" + margin.left + ',' + 0 + ")")
            .call(yAxis);

        // Color scaling
        let colorScale = d3.scaleSequential(d3['interpolateBlues'])
            .domain([0, max]);

        //---------------- Update height of bars + Animations ------------------------
        svg.select('#bars').selectAll('rect.bar')
            // .attr('class', 'bar')
            .transition().duration(2000)
            .attr('y', function (d) {
                return yScale(d[selectedDimension]);
            })
            .attr('height', function (d) {
                return height - margin.top - margin.bottom - yScale(d[selectedDimension]);
            })
            .style('fill', function (d) {
                return colorScale(d[selectedDimension])
            });
    }

    /**
     *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
     *
     *  There are 4 attributes that can be selected:
     *  goals, matches, attendance and teams.
     */
    chooseData() {
        // ******* TODO: PART I *******
        //Changed the selected data when a user selects a different
        // menu item from the drop down.
    }
    selectCup(cur) {
        // Del previous selection
        d3.select('svg#barChart').selectAll('.selected').classed('selected', false);
        d3.select(this)
            .classed('selected', true);
        d3.select('div.tooltip').remove();
        infoPanel.updateInfo(cur);
        worldMap.updateMap(cur);

    }
}