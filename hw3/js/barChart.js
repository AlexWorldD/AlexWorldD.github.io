/** Class implementing the bar chart view. */
class BarChart {

    /**
     * Create a bar chart instance and pass the other views in.
     * @param worldMap
     * @param infoPanel
     * @param allData
     */
    constructor(worldMap, infoPanel, allData) {
        this.worldMap = worldMap;
        this.infoPanel = infoPanel;
        this.allData = allData;
    }

    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     <svg width="500" height="400" id="barChart">
     <g id="xAxis"></g>
     <g id="yAxis"></g>
     <g id="bars"></g>
     </svg>
     */
    updateBarChart(selectedDimension) {

        if (selectedDimension === undefined) {
            selectedDimension = d3.select('#dataset').property("value");
        }

        let max = d3.max(this.allData, function (d) {
            return d[selectedDimension];
        });

        // space for the labels
        let textWidth = 70;
        // Getting required encoder of bars
        let svg = d3.select('#barChart'),
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
            .range([height-(margin.bottom+margin.top), 0+margin.top])
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
            .range([0, width-margin.left-margin.right]).padding(.1)
        // Setting the domain for X scale: from first to last year
            .domain(this.allData.map(function (d) { return d.YEAR}));
        let xAxis = d3.axisBottom(xScale)

        let w = xScale.range()[1];

        d3.select('#yAxis')
            .attr("transform", "translate("+ margin.left + ',' + 0 + ")")
            .call(yAxis);

        svg.select('#xAxis')
            .attr('transform', 'translate(' + margin.left + ',' + (height-margin.top-margin.bottom) + ')')
            .call(xAxis)
            .selectAll('text')
            .style("text-anchor", "end")
            .attr("dx", "-15px")
            .attr("dy", "-5px")
            .attr("transform", "rotate(-90)" );


        return;


        let barGroups = svg.selectAll('.barsGroup')
        // here we tell D3 how to know which objects are the
        // same thing between updates (object consistency)
            .data(this.allData, function (d) {
                return d.YEAR;
            });
        //---------------- Exit and Exit Animations ------------------------

        barGroups.exit()
            .attr("opacity", 1)
            .transition()
            .duration(2000)
            .attr("opacity", 0)
            .remove();

        //---------------- Enter and Enter Animations ------------------------

        let barGroupsEnter = barGroups.enter()
        // we package each data item into a g
            .append("g")
            .classed("barGroup", true)
            // and position this g globally
            .attr("transform", function (d) {
                return "translate(" + 0 + "," + xScale(d.YEAR) + ")";
            });

        barGroupsEnter.append("text").text(function (d) {
            return d.YEAR;
        })
            .attr("x", function(d) { return xScale(d.YEAR)})
            // dy is a shift along the y axis
            .attr("dx", xScale.step() / 2)
            // align it to the right
            .attr("text-anchor", "end")
            // center it
            .attr("alignment-baseline", "middle")
            .attr("opacity", 0)
            .transition().duration(2000)
            .attr("opacity", 1);

        barGroupsEnter.append("rect")
            .attr("width", "0")
            .attr("x", textWidth)
            // bandwidth accesses the automatically computed width of the bar
            .attr("height", yScale.bandwidth())
            .style("fill", function (d) {
                // here we apply the color scale
                return colorScale(d.Continent);
            })
            .attr("width", 0)
            .transition().duration(3000)
            .attr("width", function (d) {
                // here we call the scale function.
                return Math.abs(xScale(d[cur_dim]) - xScale(0));
            });
        //barGroups = barGroupsEnter.merge(barGroups);

        //---------------- Update Animations after sort --------------------

        barGroups.transition().duration(2000)
            .attr("transform", function (d) {
                return "translate(" + 0 + "," + yScale(d.Name) + ")";
            });
        // ******* TODO: PART I *******


        // Create the x and y scales; make
        // sure to leave room for the axes

        // Create colorScale

        // Create the axes (hint: use #xAxis and #yAxis)

        // Create the bars (hint: use #bars)
        svg.selectAll('#bars').selectAll("rect")
            .transition().duration(3000)
            .attr("height", function (d) {
                // here we call the scale function.
                return Math.abs(yScale(d[selectedDimension]) - yScale(0));
            });




        // ******* TODO: PART II *******

        // Implement how the bars respond to click events
        // Color the selected bar to indicate is has been selected.
        // Make sure only the selected bar has this new color.

        // Call the necessary update functions for when a user clicks on a bar.
        // Note: think about what you want to update when a different bar is selected.

    }

    /**
     *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
     *
     *  There are 4 attributes that can be selected:
     *  goals, matches, attendance and teams.
     */
    chooseData(){
        // ******* TODO: PART I *******
        //Changed the selected data when a user selects a different
        // menu item from the drop down.

    }
}