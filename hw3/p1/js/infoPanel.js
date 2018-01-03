/** Class implementing the infoPanel view. */
class InfoPanel {
    constructor() {
        let details = d3.select('#details');
        this.edition = details.select('h2#edition').classed('for_tip', true);
        this.host = details.select('#host').classed('for_tip', true);
        this.winner = details.select('#winner').classed('for_tip', true);
        this.silver = details.select('#silver').classed('for_tip', true);
        this.teams = details.select('#teams');
    }

    /**
     * Update the info panel to show info about the currently selected world cup
     * @param oneWorldCup the currently selected world cup
     */
    updateInfo(oneWorldCup) {

        // ******* TODO: PART III *******
        this.edition.text(oneWorldCup.EDITION);
        this.host.text(oneWorldCup.host).on('click', function () {
            tip(oneWorldCup.host);
        });
        this.winner.text(oneWorldCup.winner).on('click', function () {
            tip(oneWorldCup.winner);
        });
        this.silver.text(oneWorldCup.runner_up).on('click', function () {
            tip(oneWorldCup.runner_up);
        });
        let countries = oneWorldCup.teams_names.sort(d3.ascending);
        // Del previous list of participants
        let cur_list = this.teams;
        cur_list.selectAll('ul')
            .remove();
        // d3.select('#host').on('click', tip());
        // let div = d3.select("body").append("div")
        //     .attr("class", "tooltip")
        //     .style("opacity", 0);
        // Add new list
        // `TODO: update to d3.enter and d3.exit if it's possible
        cur_list.append('ul').selectAll('li').data(countries)
            .enter()
            .append('li')
            // .style('opacity', 0.0)
            .text(function (d) {
                return d;
            })
            .on('click', tip);
        // let test  = d3.select('#details').select('#host')
        // .transition().duration(500)
        // .style('opacity', 1.0);

        //10% extra credit: make all the countries respond to a click event by displaying a list of World Cups they participated in. Also display if they were ever winners or runner ups. Add this information to a new, separate panel.
    }
}