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
            .range([0, 2*this.cell.width]);

        /** Used for games/wins/losses*/
            // It's obvious, that MAX value is 7, but let's calculate it ^_^
        let maxGames = Math.max.apply(Math, this.teamData.map(o => o.value['TotalGames']));
        this.gameScale = d3.scaleLinear()
            .domain([0, maxGames])
            .range([0, this.cell.width - 0]);

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

        // ******* TODO: PART II *******

        d3.select('#goalHeader').append('svg')
            .style('padding', '0 0 0 5px')
            .attr('height', this.cell.height+5)
            .attr('width', 2*this.cell.width+10)
            .append('g')
            .attr('transform', 'translate(' + 0 + ',' + 20 + ')')
            .call(d3.axisTop(this.goalScale));

        // ******* TODO: PART V *******

        // Set sorting callback for clicking on headers

        // Clicking on headers should also trigger collapseList() and updateTable(). 


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
        // rows
        //     .on('click', (d, i) => {
        //         if (d.value.type == 'aggregate') {
        //             this.updateList(d, i);
        //         }
        //
        //     })


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
        tds.filter(function (d) {
            return d.vis == 'title'
        })
            .attr('class', 'aggregate')
            .text(d => d.value);
        tds.filter(function (d) {
            return d.vis == 'text'
        })
            .text(d => d.value);
        // Work with bars for game stats
        var bar_items = tds.filter(function (d) {
            return d.type == 'aggregate' && d.vis == 'bar' && d.value>0
        })
            .append('svg')
            .attr('width', this.cell.width)
            .attr('height', this.cell.height)
            .append('g');
        bar_items
            .append('rect')
            .attr('height', this.cell.height)
            .attr('width', d => this.gameScale(d.value))
            .style('fill', d =>this.aggregateColorScale(d.value));
        bar_items
            .append('text')
            .text(d=>d.value)
            .attr('y', this.cell.height/2)
            .attr('dy', '0.33em')
            .attr('x', d=> this.gameScale(d.value-0.9))
            // .attr('dx', '-0.05em')
            .attr('class', 'label');
        // Work with goals vis
        var goals_items = tds.filter(function (d) {
            return d.type == 'aggregate' && d.vis == 'goals'
        })
            .append('svg')
            .attr('width', 2*this.cell.width+5)
            .attr('height', this.cell.height)
            .append('g');
        goals_items.append('rect')
            .attr('width', d => this.goalScale(Math.abs(d.value[0]-d.value[1])))
            .attr('x', d => this.goalScale(Math.min(d.value[0],d.value[1])))
            .attr('height', 10)
            .attr('y', this.cell.height/2-5)
            .attr('dy', '0.33em')
            .style('fill', d=> d.value[0] < d.value[1] ? '#cb181d' : '#034e7b')
            .attr('class', 'goalBar');
        // Blue one
        goals_items.append('circle')
            .attr('cx', d => this.goalScale(d.value[0]))
            .attr('cy', this.cell.height/2)
            .style('fill', '#034e7b')
            .attr('class', 'goalCircle');
        // Red one
        goals_items.append('circle')
            .attr('cx', d => this.goalScale(d.value[1]))
            .attr('cy', this.cell.height/2)
            .style('fill', d=> d.value[0]-d.value[1]==0 ? '#555555':'#cb181d')
            .attr('class', 'goalCircle');
        console.log(goals_items)



        //Append th elements for the Team Names

        //Append td elements for the remaining columns. 
        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'value':<[array of 1 or two elements]>}

        //Add scores as title property to appear on hover

        //Populate cells (do one type of cell at a time )

        //Create diagrams in the goals column

        //Set the color of all games that tied to light gray

    };

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        // ******* TODO: PART IV *******

        //Only update list for aggregate clicks, not game clicks

    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {

        // ******* TODO: PART IV *******

    }


}
