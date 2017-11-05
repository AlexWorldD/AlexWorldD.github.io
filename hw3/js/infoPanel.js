/** Class implementing the infoPanel view. */
class InfoPanel {
    constructor() {
        let details = d3.select('#details');
        this.edition = details.select('#edition');
        this.host = details.select('#host');
        this.winner = details.select('#winner');
        this.silver = details.select('#silver');
        this.teams = details.select('#teams');
    }

    /**
     * Update the info panel to show info about the currently selected world cup
     * @param oneWorldCup the currently selected world cup
     */
    updateInfo(oneWorldCup) {

        // ******* TODO: PART III *******
        this.edition.text(oneWorldCup.EDITION);
        this.host.text(oneWorldCup.host);
        this.winner.text(oneWorldCup.winner);
        this.silver.text(oneWorldCup.runner_up);
        let countries = oneWorldCup.teams_names.sort(d3.ascending);
        // Del previous list of participants
        let cur_list = this.teams;
        cur_list.selectAll('ul')
            .remove();
        // Add new list
        // `TODO: update to d3.enter and d3.exit if it's possible
        cur_list.append('ul').selectAll('li').data(countries)
            .enter()
            .append('li')
            // .style('opacity', 0.0)
            .text(function (d) {
                return d;
            })
            // .transition().duration(500)
            // .style('opacity', 1.0);
    }
}