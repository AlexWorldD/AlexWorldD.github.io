class ElectoralVoteChart {
    /**
     * Constructor for the ElectoralVoteChart
     *
     * @param shiftChart an instance of the ShiftChart class
     */
    constructor(shiftChart) {
        this.shiftChart = shiftChart;

        this.margin = {top: 30, right: 20, bottom: 30, left: 20};
        let divelectoralVotes = d3.select('#electoral-vote').classed('content', true);

        //Gets access to the div element created for this chart from HTML
        this.svgBounds = divelectoralVotes.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 150;

        //creates svg element within the div
        this.svg = divelectoralVotes.append('svg')
            .attr('width', this.svgWidth)
            .attr('height', this.svgHeight);
        this._mid = true;

    };

    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass(party) {
        if (party === 'R') {
            return 'republican';
        }
        else if (party === 'D') {
            return 'democrat';
        }
        else if (party === 'I') {
            return 'independent';
        }
    }


    /**
     * Creates the stacked bar chart, text content and tool tips for electoral vote chart
     *
     * @param electionResult election data for the year selected
     * @param colorScale global quantile scale based on the winning margin between republicans and democrats
     */

    update(electionResult, colorScale) {

        // ******* TODO: PART II ******
        //Working with Data
        let data = [];
        // I hate wrong this inside functions(((
        let self = this;
        let shift = 0;
        let yearResult = d3.nest()
            .key(d => d.State_Winner)
            .rollup(function (party) {
                return party.map(state => ({
                    'State_Winner': state.State_Winner,
                    'State': state.State,
                    'RD_Difference': state.RD_Difference,
                    'Total_EV': state.Total_EV
                }))
                    .sort((a, b) => a.RD_Difference - b.RD_Difference)
            })
            .entries(electionResult);
        yearResult
            .forEach(party => (party.key === 'I' ? data = party.value.concat(data) : data = data.concat(party.value)));
        let votes = yearResult
            .map(function (party) {
                return {
                    'Party': party.key,
                    'Votes': d3.sum(party.value, item => item.Total_EV)
                }
            });
        const sum = d3.sum(data, d => d.Total_EV);
        let chart = this.svg
            .selectAll('rect')
            .data(data);
        chart
            .exit()
            .remove();
        chart = chart
            .enter()
            .append('rect')
            .merge(chart);
        chart
            .attr('y', 50)
            .attr('x', function (d) {
                let _x = shift;
                shift += d.Total_EV * self.svgWidth / sum;
                return _x;
            })
            .attr('width', d => d.Total_EV * this.svgWidth / sum)
            .attr('class', 'electoralVotes')
            .attr('fill', d => (d.State_Winner === 'I' ? '#45AD6A' : colorScale(d.RD_Difference)));

        let VotesText = this.svg
            .selectAll('text')
            .data(votes);
        VotesText
            .exit()
            .remove();
        VotesText
            .enter()
            .append('text')
            .merge(VotesText)
            .attr('dy', 40)
            .attr('dx', function (d, i) {
                if (votes.length === 3) {
                    if (d.Party === 'I') {
                        return 0
                    }
                    if (i === votes.length - 1) {
                        return self.svgWidth;
                    }
                    else {
                        return votes[i + 1].Votes * self.svgWidth / sum;
                    }
                }
                else {
                    if (i === 0) {
                        return 0
                    }
                    if (i === votes.length - 1) {
                        return self.svgWidth;
                    }
                }
            })
            .attr('class', d => ('electoralVoteText ' + this.chooseClass(d.Party)))
            .text(d => d.Votes);
        if (this._mid) {
            this.svg
                .append('line')
                .attr('x1', this.svgWidth/2)
                .attr('x2', this.svgWidth/2)
                .attr('y1', 40)
                .attr('y2', 90)
                .attr('class', 'middle_line');
            this._mid = false
        }
        this.svg
            .append('text')
            .attr('dx', this.svgWidth/2)
            .attr('dy', 32)
            .attr('id', 'mid_elec')
            .attr('class', 'electoralVotesNote')
            .text('Electoral Vote ('+(Math.ceil(sum/2)+1)+' needed to win)');

        
        //Group the states based on the winning party for the state;
        //then sort them based on the margin of victory


        //Create the stacked bar chart.
        //Use the global color scale to color code the rectangles.
        //HINT: Use .electoralVotes class to style your bars.

        //Display total count of electoral votes won by the Democrat and Republican party
        //on top of the corresponding groups of bars.
        //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
        // chooseClass to get a color based on the party wherever necessary

        //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
        //HINT: Use .middlePoint class to style this bar.

        //Just above this, display the text mentioning the total number of electoral votes required
        // to win the elections throughout the country
        //HINT: Use .electoralVotesNote class to style this text element

        //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

        //******* TODO: PART V *******
        //Implement brush on the bar chart created above.
        //Implement a call back method to handle the brush end event.
        //Call the update method of shiftChart and pass the data corresponding to brush selection.
        //HINT: Use the .brush class to style the brush.


    };


}
