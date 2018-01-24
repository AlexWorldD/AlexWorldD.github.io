/** Class implementing the votePercentageChart. */
class VotePercentageChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor() {
        this.margin = {top: 30, right: 20, bottom: 30, left: 20};
        let divvotesPercentage = d3.select("#votes-percentage").classed("content", true);

        //fetch the svg bounds
        this.svgBounds = divvotesPercentage.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 100;

        //add the svg to the div
        this.svg = divvotesPercentage.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
            .attr("transform", "translate(" + this.margin.left + ",0)");
    }

    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass(data) {
        if (data === "R") {
            return "republican";
        }
        else if (data === "D") {
            return "democrat";
        }
        else if (data === "I") {
            return "independent";
        }
    }

    /**
     * Renders the HTML content for tool tip
     *
     * @param tooltip_data information that needs to be populated in the tool tip
     * @return text HTML content for toop tip
     */
    tooltip_render(tooltip_data) {
        let text = "<ul>";
        tooltip_data.forEach((row) => {
            text += "<li class = " + this.chooseClass(row.Party) + ">" + row.Nominee + " " + row.Votes + " (" + row.Percent + ") " + "</li>"
        });
        return text + "</ul>"
    }

    /**
     * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
     *
     * @param electionResult election data for the year selected
     */
    update(electionResult) {

        //for reference:https://github.com/Caged/d3-tip
        //Use this tool tip element to handle any hover over the chart
        let data = [];
        let self = this;
        let shift = 0;
        data = ['I', 'D', 'R'].map(function (party) {
            return {
                'Party': party,
                'Nominee': electionResult[0][party + '_Nominee_prop'],
                'Votes': parseInt(electionResult[0][party + '_Votes_Total']),
                'Percent': electionResult[0][party + '_PopularPercentage'],
            }
        });
        if (data[0].Nominee === " ")
            data.splice(0, 1);
        let tip = d3.tip().attr('class', 'd3-tip')
            .direction('s')
            .offset(function () {
                return [0, 0];
            })
            .html((d) => {
                return this.tooltip_render(data)
            });
        this.svg
            .call(tip);
        const sum = d3.sum(data, d => d.Votes);
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
                shift += d.Votes * self.svgWidth / sum;
                return _x;
            })
            .attr('width', d => d.Votes * this.svgWidth / sum)
            .attr('class', d => ('electoralVotes votesPercentage ' + this.chooseClass(d.Party)))
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);
        this.svg
            .selectAll('g')
            .remove();
        let VotesText = this.svg
            .selectAll('g')
            .data(data)
            .enter()
            .append('g');
        VotesText
            .append('text')
            .attr('dy', 15)
            .attr('dx', function (d, i) {
                if (i === 0) {
                    return 0;
                }
                if (i === data.length - 1) {
                    return self.svgWidth;
                }
                else {
                    return (data[i - 1].Votes + 150) * self.svgWidth / sum + 150;
                }
            })
            .attr('class', d => ('votesPercentageText ' + this.chooseClass(d.Party)))
            .text(d => d.Nominee);
        VotesText
            .append('text')
            .attr('dy', 40)
            .attr('dx', function (d, i) {
                if (i === 0) {
                    return 0;
                }
                if (i === data.length - 1) {
                    return self.svgWidth;
                }
                else {
                    return (data[i - 1].Votes) * self.svgWidth / sum + 150;
                }
            })
            .attr('class', d => ('votesPercentageText ' + this.chooseClass(d.Party)))
            .text(d => d.Percent);
        this.svg
            .selectAll('.electoralVotesNote')
            .remove();
        this.svg
            .selectAll('.middle_line')
            .remove();
        this.svg
            .append('line')
            .attr('x1', this.svgWidth / 2)
            .attr('x2', this.svgWidth / 2)
            .attr('y1', 40)
            .attr('y2', 90)
            .attr('class', 'middle_line');
        this.svg
            .append('text')
            .attr('dx', this.svgWidth / 2)
            .attr('dy', 32)
            .attr('class', 'electoralVotesNote')
            .text('Popular Vote (50%)');
        // ******* TODO: PART III *******

        //Create the stacked bar chart.
        //Use the global color scale to color code the rectangles.
        //HINT: Use .votesPercentage class to style your bars.

        //Display the total Percent of votes won by each party
        //on top of the corresponding groups of bars.
        //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
        // chooseClass to get a color based on the party wherever necessary

        //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
        //HINT: Use .middlePoint class to style this bar.

        //Just above this, display the text mentioning details about this mark on top of this bar
        //HINT: Use .votesPercentageNote class to style this text element

        //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
        //then, vote Percent and number of votes won by each party.

        //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    };
}