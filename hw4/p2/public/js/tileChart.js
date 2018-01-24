/** Class implementing the tileChart. */
class TileChart {

    /**
     * Initializes the svg elements required to lay the tiles
     * and to populate the legend.
     */
    constructor() {

        let divTiles = d3.select("#tiles").classed("content", true);
        this.margin = {top: 30, right: 20, bottom: 30, left: 20};
        //Gets access to the div element created for this chart and legend element from HTML
        let svgBounds = divTiles.node().getBoundingClientRect();
        this.svgWidth = svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = this.svgWidth / 2;
        let legendHeight = 150;
        //add the svg to the div
        let legend = d3.select("#legend").classed("content", true);

        //creates svg elements within the div
        this.legendSvg = legend.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", legendHeight)
            .attr("transform", "translate(" + this.margin.left + ",0)");
        this.svg = divTiles.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
            .attr("transform", "translate(" + this.margin.left + ",0)")
    };

    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass(party) {
        if (party === "R") {
            return "republican";
        }
        else if (party === "D") {
            return "democrat";
        }
        else if (party === "I") {
            return "independent";
        }
    }

    /**
     * Renders the HTML content for tool tip.
     *
     * @param tooltip_data information that needs to be populated in the tool tip
     * @return text HTML content for tool tip
     */
    tooltip_render(tooltip_data) {
        let text = "<h2 class =" + this.chooseClass(tooltip_data.winner) + " >" + tooltip_data.state + "</h2>";
        text += "Electoral Votes: " + tooltip_data.electoralVotes;
        text += "<ul>";
        tooltip_data.result.forEach((row) => {
            //text += "<li>" + row.nominee+":\t\t"+row.Votes+"("+row.Percent+"%)" + "</li>"
            text += "<li class = " + this.chooseClass(row.Party) + ">" + row.Nominee + ": " + row.Votes + " (" + row.Percent + "%)" + "</li>"
        });
        text += "</ul>";
        return text;
    }

    /**
     * Creates tiles and tool tip for each state, legend for encoding the color scale information.
     *
     * @param electionResult election data for the year selected
     * @param colorScale global quantile scale based on the winning margin between republicans and democrats
     */
    update(electionResult, colorScale) {

        //Calculates the maximum number of columns to be laid out on the svg
        this.maxColumns = d3.max(electionResult, function (d) {
            return parseInt(d["Space"]);
        });

        //Calculates the maximum number of rows to be laid out on the svg
        this.maxRows = d3.max(electionResult, function (d) {
            return parseInt(d["Row"]);
        });
        let tile_w = this.svgWidth / (this.maxColumns + 1);
        let tile_h = this.svgHeight / (this.maxRows + 1);

        //Creates a legend element and assigns a scale that needs to be visualized
        this.legendSvg.append("g")
            .attr("class", "legendQuantile")
            .attr("transform", "translate(0,50)");

        let legendQuantile = d3.legendColor()
            .shapeWidth(tile_w)
            .shapePadding(0)
            .orient('horizontal')
            .scale(colorScale);

        this.legendSvg.select(".legendQuantile")
            .call(legendQuantile);

        //for reference:https://github.com/Caged/d3-tip
        //Use this tool tip element to handle any hover over the chart
        let tip = d3.tip().attr('class', 'd3-tip')
            .direction('se')
            .offset(function () {
                return [0, 0];
            })
            .html((d) => {
                let tooltip_data = {
                    "state": d.State,
                    "winner": d.State_Winner,
                    "electoralVotes": d.Total_EV,
                    "result": function (d) {
                        if (d.I_Votes === "") {
                            return [
                                {
                                    "Nominee": d.D_Nominee_prop,
                                    "Votes": d.D_Votes,
                                    "Percent": d.D_Percentage,
                                    "Party": "D"
                                },
                                {
                                    "Nominee": d.R_Nominee_prop,
                                    "Votes": d.R_Votes,
                                    "Percent": d.R_Percentage,
                                    "Party": "R"
                                }
                            ]
                        }
                        else {
                            return [
                                {
                                    "Nominee": d.D_Nominee_prop,
                                    "Votes": d.D_Votes,
                                    "Percent": d.D_Percentage,
                                    "Party": "D"
                                },
                                {
                                    "Nominee": d.R_Nominee_prop,
                                    "Votes": d.R_Votes,
                                    "Percent": d.R_Percentage,
                                    "Party": "R"
                                },
                                {
                                    "Nominee": d.I_Nominee_prop,
                                    "Votes": d.I_Votes,
                                    "Percent": d.I_Percentage,
                                    "Party": "I"
                                }
                            ]
                        }
                    }(d)
                };
                return this.tooltip_render(tooltip_data);
            });

        // ******* TODO: PART IV *******

        this.svg
            .call(tip);
        this.svg
            .selectAll('.tiles')
            .remove();
        let tile = this.svg
            .selectAll('.tiles')
            .data(electionResult)
            .enter()
            .append('g')
            .attr('class', 'tiles')
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);
        tile
            .append('rect')
            .attr('x', d => d.Space * tile_w)
            .attr('y', d => d.Row * tile_h)
            .attr('width', tile_w)
            .attr('height', tile_h)
            .attr('class', 'tile')
            .attr('fill', d => d.State_Winner === 'I' ? '#45AD6A' : colorScale(d.RD_Difference));

        tile
            .append('text')
            .attr('class', 'tilestext')
            .attr('x', d => d.Space * tile_w+tile_w/2)
            .attr('y', d => d.Row * tile_h+tile_h*0.5)
            .text(d=>d.Abbreviation);
        tile
            .append('text')
            .attr('class', 'tilestext')
            .attr('x', d => d.Space * tile_w+tile_w/2)
            .attr('y', d => d.Row * tile_h+tile_h*0.75)
            .text(d=>d.Total_EV);

        //Tansform the legend element to appear in the center and make a call to this element for it to display.

        //Lay rectangles corresponding to each state according to the 'row' and 'column' information in the data.

        //Display the state abbreviation and number of electoral votes on each of these rectangles

        //Use global color scale to color code the tiles.

        //HINT: Use .tile class to style your tiles;
        // .tilestext to style the text corresponding to tiles

        //Call the tool tip on hover over the tiles to display stateName, count of electoral votes
        //then, vote Percent and number of votes won by each party.
        //HINT: Use the .republican, .democrat and .independent classes to style your elements.
    };
    faded(states) {
        if (states.length>0) {
            this.svg
                .selectAll('.tiles')
                .classed('faded', true);
            this.svg
                .selectAll('.tiles')
                .filter(d=>states.includes(d.State))
                .classed('faded', false);
        }
        else {
            this.svg
                .selectAll('.tiles')
                .classed('faded', false);
        }
    }


}
