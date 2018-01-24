class YearChart {

    /**
     * Constructor for the Year Chart
     *
     * @param electoralVoteChart instance of ElectoralVoteChart
     * @param tileChart instance of TileChart
     * @param votePercentageChart instance of Vote Percentage Chart
     * @param electionInfo instance of ElectionInfo
     * @param electionWinners data corresponding to the winning parties over mutiple election years
     */
    constructor(electoralVoteChart, tileChart, votePercentageChart, electionWinners) {

        //Creating YearChart instance
        this.electoralVoteChart = electoralVoteChart;
        this.tileChart = tileChart;
        this.votePercentageChart = votePercentageChart;
        // the data
        this.electionWinners = electionWinners;

        // Initializes the svg elements required for this chart
        this.margin = {top: 10, right: 20, bottom: 30, left: 20};
        let divyearChart = d3.select('#year-chart').classed('fullView', true);

        //fetch the svg bounds
        this.svgBounds = divyearChart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 100;

        //add the svg to the div
        this.svg = divyearChart.append('svg')
            .attr('width', this.svgWidth)
            .attr('height', this.svgHeight)
    };


    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    static chooseClass(data) {
        if (data === 'R') {
            return 'yearChart republican';
        }
        else if (data === 'D') {
            return 'yearChart democrat';
        }
        else if (data === 'I') {
            return 'yearChart independent';
        }
    }

    /**
     * Creates a chart with circles representing each election year, populates text content and other required elements for the Year Chart
     */
    update() {

        let self = this;
        //Domain definition for global color scale
        let domain = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60];

        //Color range for global color scale
        let range = ['#063e78', '#08519c', '#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#fcbba1', '#fc9272', '#fb6a4a', '#de2d26', '#a50f15', '#860308'];

        //ColorScale be used consistently by all the charts
        this.colorScale = d3.scaleQuantile()
            .domain(domain)
            .range(range);
        // ******* TODO: PART I *******
        let xScale = d3.scaleLinear()
            .domain([d3.min(this.electionWinners, d => d.YEAR), d3.max(this.electionWinners, d => d.YEAR)])
            .range([50 + this.margin.left, this.svgWidth - 50]);
        this.svg
            .append('line')
            .attr('x1', this.margin.left)
            .attr('y1', this.svgHeight / 2)
            .attr('x2', this.svgWidth)
            .attr('y2', this.svgHeight / 2)
            .attr('id', 'year_line');
        let years = this.svg
            .selectAll('.year')
            .data(this.electionWinners)
            .enter()
            .append('g')
            .attr('class', 'year');
        years
            .append('text')
            .attr('dx', d => xScale(d.YEAR))
            .attr('dy', 85)
            .attr('class', 'yearText')
            .text(d => d.YEAR);
        years
            .append('circle')
            .attr('class', d => 'year_dot ' + YearChart.chooseClass(d.PARTY))
            .attr('transform', d => "translate(" + xScale(d.YEAR) + ",50)");
        years.on('click', function (cur_year) {
            years
                .selectAll('circle')
                .classed('selected', false)
                .classed('highlighted', false);
            d3.select(this)
                .select('circle')
                .classed('selected', true);
            d3.csv('data/Year_Timeline_' + cur_year.YEAR + '.csv', function (error, electionResult) {
                self.electoralVoteChart.update(electionResult, self.colorScale);
                self.tileChart.update(electionResult, self.colorScale);
                self.votePercentageChart.update(electionResult);
            })
        })
            .on('mouseover', function (cur_year) {
                years
                    .selectAll('circle')
                    .classed('highlighted', false);
                d3.select(this)
                    .select('circle')
                    .classed('highlighted', true);
            })
            .on('mouseout', d => {
                years
                    .selectAll('circle')
                    .classed('highlighted', false);
            });


        // Create the chart by adding circle elements representing each election year
        //The circles should be colored based on the winning party for that year
        //HINT: Use the .yearChart class to style your circle elements
        //HINT: Use the chooseClass method to choose the color corresponding to the winning party.

        //Append text information of each year right below the corresponding circle
        //HINT: Use .yeartext class to style your text elements

        //Style the chart by adding a dashed line that connects all these years.
        //HINT: Use .lineChart to style this dashed line

        //Clicking on any specific year should highlight that circle and  update the rest of the visualizations
        //HINT: Use .highlighted class to style the highlighted circle

        //Election information corresponding to that year should be loaded and passed to
        // the update methods of other visualizations


        //******* TODO: EXTRA CREDIT *******

        //Implement brush on the year chart created above.
        //Implement a call back method to handle the brush end event.
        //Call the update method of shiftChart and pass the data corresponding to brush selection.
        //HINT: Use the .brush class to style the brush.

    };

};