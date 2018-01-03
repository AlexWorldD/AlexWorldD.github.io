/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {

        //Maintain reference to the tree Object; 
        this.tree = treeObject;


        this.tableElements = teamData.slice(); //

        ///** Store all match data for the 2014 Fifa cup */
        this.teamData = teamData;

        //Default values for the Table Headers
        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        /** To be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';

        /** Setup the scales*/
        let maxGoal = Math.max.apply(Math, this.teamData.map(o => Math.max(o.value['Goals Made'], o.value['Goals Conceded'])));
        this.goalScale = d3.scaleLinear()
            .domain([0, maxGoal])
            .range([0, 2 * this.cell.width]);

        /** Used for games/wins/losses*/
            // It's obvious, that MAX value is 7, but let's calculate it ^_^
        let maxGames = Math.max.apply(Math, this.teamData.map(o => o.value['TotalGames']));
        this.gameScale = d3.scaleLinear()
            .domain([0, maxGames])
            .range([0, this.cell.width]);

        /**Color scales*/
        /**For aggregate columns  Use colors '#ece2f0', '#016450' for the range.*/
        this.aggregateColorScale = d3.scaleLinear()
            .domain([0, maxGames])
            .range(['#ece2f0', '#016450']);

        /**For goal Column. Use colors '#cb181d', '#034e7b'  for the range.*/
        this.goalColorScale = d3.scaleLinear()
            .domain([0, maxGoal])
            .range(['#cb181d', '#034e7b']);
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {
        let sortAscending = true;

        // ******* TODO: PART II *******

        d3.select('#goalHeader').append('svg')
            .style('padding', '0 0px 0 15px')
            .attr('height', this.cell.height + 5)
            .attr('width', 2 * this.cell.width + 20)
            .append('g')
            .attr('transform', 'translate(' + 0 + ',' + 20 + ')')
            .call(d3.axisTop(this.goalScale));

        // ******* TODO: PART V *******
        d3.selectAll('th')
            .on('click', (_, i) => {
                d3.select('tr').selectAll('th').classed('aes', false);
                d3.select('tr').selectAll('th').classed('des', false);
                this.collapseList();
                // KOSTYL' here... I hate js for vars scopes... In common function I cannot use 'this', ok - thx =>
                // but I did not find any fitted examples, how to give additional argument to built-in sort function,
                // that's why it looks like a piece of shit, but works good))
                if (sortAscending) {
                    sortAscending = false;
                    switch (i) {
                        case 0:
                            this.tableElements.sort((a, b) => d3.ascending(a.key, b.key));
                            break;
                        case 1:
                            this.tableElements.sort((a, b) => d3.ascending(a.value['Goals Made'], b.value['Goals Made']));
                            break;
                        case 2:
                            this.tableElements.sort((a, b) => d3.ascending(a.value.Result.ranking, b.value.Result.ranking));
                            break;
                        case 3:
                            this.tableElements.sort((a, b) => d3.ascending(a.value.Wins, b.value.Wins));
                            break;
                        case 4:
                            this.tableElements.sort((a, b) => d3.ascending(a.value.Losses, b.value.Losses));
                            break;
                        case 5:
                            this.tableElements.sort((a, b) => d3.ascending(a.value.TotalGames, b.value.TotalGames));
                            break;
                    }
                    d3.select('tr').selectAll('th').filter(function (d, it) {
                        return it === i;
                    }).classed('aes', true);
                    d3.select('tr').selectAll('th').filter(function (d, it) {
                        return it === i;
                    }).classed('des', false);

                }
                else {
                    sortAscending = true;
                    switch (i) {
                        case 0:
                            this.tableElements.sort((a, b) => d3.descending(a.key, b.key));
                            break;
                        case 1:
                            this.tableElements.sort((a, b) => d3.descending(a.value['Goals Made'], b.value['Goals Made']));
                            break;
                        case 2:
                            this.tableElements.sort((a, b) => d3.descending(a.value.Result.ranking, b.value.Result.ranking));
                            break;
                        case 3:
                            this.tableElements.sort((a, b) => d3.descending(a.value.Wins, b.value.Wins));
                            break;
                        case 4:
                            this.tableElements.sort((a, b) => d3.descending(a.value.Losses, b.value.Losses));
                            break;
                        case 5:
                            this.tableElements.sort((a, b) => d3.descending(a.value.TotalGames, b.value.TotalGames));
                            break;
                    }
                    d3.select('tr').selectAll('th').filter(function (d, it) {
                        return it === i;
                    }).classed('aes', false);
                    d3.select('tr').selectAll('th').filter(function (d, it) {
                        return it === i;
                    }).classed('des', true);
                }
                this.updateTable();

            })
    }


    updateTable() {
        // ******* TODO: PART III *******
        //Create table rows
        let rows = d3.select('tbody')
            .selectAll('tr')
            .data(this.tableElements);
        rows.exit()
            .remove();
        rows = rows.enter()
            .append('tr')
            .merge(rows);
        rows
            .on('click', (d, i) => {
                if (d.value.type === 'aggregate') {
                    this.updateList(d, i);
                }

            });
        // KOSTYL' here %)
        rows.selectAll('td').remove();
        let tds = rows.selectAll('td')
            .data(function (d) {
                // console.log(d);
                return [
                    {'type': d.value.type, 'vis': 'title', 'value': d.key},
                    {'type': d.value.type, 'vis': 'goals', 'value': [d.value['Goals Made'], d.value['Goals Conceded']]},
                    {'type': d.value.type, 'vis': 'text', 'value': d.value.Result.label},
                    {'type': d.value.type, 'vis': 'bar', 'value': d.value.Wins},
                    {'type': d.value.type, 'vis': 'bar', 'value': d.value.Losses},
                    {'type': d.value.type, 'vis': 'bar', 'value': d.value.TotalGames},
                ]
            });
        tds.exit().remove();
        tds = tds.enter()
            .append('td')
            .merge(tds);
        // TITLE TDs --------------
        tds.filter(function (d) {
            return d.type === 'game'
        })
            .attr('class', 'hide');
        tds.filter(function (d) {
            return d.vis === 'title' && d.type === 'aggregate'
        })
            .attr('class', 'aggregate')
            .text(d => d.value);
        tds.filter(function (d) {
            return d.vis === 'title' && d.type === 'game'
        })
            .attr('class', 'game_type hide')
            .text(d => 'x' + d.value);
        // RESULT TDs --------------
        tds.filter(function (d) {
            return d.vis === 'text' && d.type === 'aggregate'
        })
            .text(d => d.value);
        tds.filter(function (d) {
            return d.vis === 'text' && d.type === 'game'
        })
            .attr('class', 'hide')
            .append('span')
            .style('opacity', 0.66)
            .text(d => d.value);
        // BARS TDs --------------
        // Work with bars for game stats
        let bar_items = tds.filter(function (d) {
            return d.type === 'aggregate' && d.vis === 'bar' && d.value > 0
        })
            .append('svg')
            .attr('width', this.cell.width)
            .attr('height', this.cell.height)
            .append('g');
        bar_items
            .append('rect')
            .attr('height', this.cell.height)
            .attr('width', d => this.gameScale(d.value))
            .style('fill', d => this.aggregateColorScale(d.value));
        bar_items
            .append('text')
            .text(d => d.value)
            .attr('y', this.cell.height / 2)
            .attr('dy', '0.33em')
            .attr('x', d => this.gameScale(d.value - 0.9))
            // .attr('dx', '-0.05em')
            .attr('class', 'label');
        // GOALS TDs --------------
        // Work with AGGREGATED goals vis
        let goals_items = tds.filter(function (d) {
            return d.type === 'aggregate' && d.vis === 'goals'
        })
            .append('svg')
            .style('padding', '0 5px 0 15px')
            .attr('width', 2 * this.cell.width + 10)
            .attr('height', this.cell.height)
            .append('g');
        goals_items.append('rect')
            .attr('width', d => this.goalScale(Math.abs(d.value[0] - d.value[1])))
            .attr('x', d => this.goalScale(Math.min(d.value[0], d.value[1])))
            .attr('height', 12)
            .attr('y', this.cell.height / 2 - 6)
            .attr('dy', '0.33em')
            .style('fill', d => d.value[0] < d.value[1] ? '#cb181d' : '#034e7b')
            .attr('class', 'goalBar');
        // Blue one
        goals_items.append('circle')
            .attr('cx', d => this.goalScale(d.value[0]))
            .attr('cy', this.cell.height / 2)
            .style('fill', '#034e7b')
            .attr('class', 'goalCircle');
        // Red one
        goals_items.append('circle')
            .attr('cx', d => this.goalScale(d.value[1]))
            .attr('cy', this.cell.height / 2)
            .style('fill', d => d.value[0] - d.value[1] === 0 ? '#555555' : '#cb181d')
            .attr('class', 'goalCircle');
        // Work with GAMED goals vis
        let goals_items2 = tds.filter(function (d) {
            return d.type === 'game' && d.vis === 'goals'
        })
            .append('svg')
            .style('padding', '0 5px 0 15px')
            .attr('width', 2 * this.cell.width + 5)
            .attr('height', this.cell.height)
            .append('g');
        goals_items2.append('rect')
            .attr('width', d => this.goalScale(Math.abs(d.value[0] - d.value[1])))
            .attr('x', d => this.goalScale(Math.min(d.value[0], d.value[1])))
            .attr('height', 3)
            .attr('y', (this.cell.height - 3) / 2)
            .attr('dy', '0.33em')
            .style('fill', d => d.value[0] < d.value[1] ? '#cb181d' : '#034e7b')
            .attr('class', 'goalBar');
        // Blue one
        goals_items2.append('circle')
            .attr('cx', d => this.goalScale(d.value[0]))
            .attr('cy', this.cell.height / 2)
            .style('fill', 'white')
            .style('stroke', '#034e7b')
            .attr('class', 'goalCircle2');
        // Red one
        goals_items2.append('circle')
            .attr('cx', d => this.goalScale(d.value[1]))
            .attr('cy', this.cell.height / 2)
            .style('fill', 'white')
            .style('stroke', d => d.value[0] - d.value[1] === 0 ? '#555555' : '#cb181d')
            .attr('class', 'goalCircle2');

    };
    updateList(data, i) {
        // ******* TODO: PART IV *******
        let patch = this.tableElements[i].value.games;
        if (this.tableElements.length === i + 1 || this.tableElements[i + 1].value.type === 'aggregate') {
            this.tableElements.splice(1 + i, 0, ...patch);
        }
        else {
            this.tableElements.splice(1 + i, patch.length)
        }
        //Only update list for aggregate clicks, not game clicks
        this.updateTable();

    }
    collapseList() {
        // ******* TODO: PART IV *******
        this.tableElements = this.tableElements.filter(d => d.value.type === 'aggregate')
    }
}
