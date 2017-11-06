/** Class implementing the map view. */
class Map {
    /**
     * Creates a Map Object
     */
    constructor() {
        this.projection = d3.geoConicConformal().scale(150).translate([400, 350]);
        this.map = d3.select('svg#world_map').select('#map');
        this.points = d3.select('svg#world_map').select('#points');
    }

    /**
     * Function that clears the map
     */
    clearMap() {
        this.map.selectAll('.countries')
            .classed('countries', true)
            .classed('host', false)
            .classed('team', false);
        this.points.html('');
    }

    /**
     * Update Map with info for a specific FIFA World Cup
     * @param wordcupData the data for one specific world cup
     */
    updateMap(worldcupData) {

        // Clear any previous selections;
        this.clearMap();
        let projection = this.projection;
        // Update classes for required World Cup
        let teams = worldcupData.teams_iso;
        for (let cur in teams) {
            this.map.select('#' + teams[cur])
                .classed('team', true);
        }
        this.map.select('#' + worldcupData.host_country_code)
            .classed('host', true);
        // Add a marker for the winner and runner up to the map.

        // Hint: remember we have a conveniently labeled class called .winner
        // as well as a .silver. These have styling attributes for the two
        // markers.
        let winner = [worldcupData.WIN_LON, worldcupData.WIN_LAT];
        let silver = [worldcupData.RUP_LON, worldcupData.RUP_LAT];
        this.points
            .append('circle')
            .attr('cx', function (d) {
                return projection(winner)[0];
            })
            .attr('cy', function (d) {
                return projection(winner)[1];
            })
            .attr('r', '10px')
            .attr('class', 'gold');
        this.points
            .append('circle')
            .attr('cx', function (d) {
                return projection(silver)[0];
            })
            .attr('cy', function (d) {
                return projection(silver)[1];
            })
            .attr('r', '8px')
            .attr('class', 'silver');
    }

    /**
     * Renders the actual map
     * @param the json data with the shape of all countries
     */
    drawMap(world) {

        // First of all create var with converter from GEOJson to string for svg
        let path = d3.geoPath()
            .projection(this.projection);
        // let countries = topojson.feature(world, world.objects.countries).features;
        let countries = world.features;
        this.map.selectAll('path')
            .data(countries)
            .enter()
            .append('path')
            .classed('countries', true)
            .attr('id', function (d) {
                return d.id;
            })
            .attr('d', path);
        this.map
            .append('path')
            .datum(d3.geoGraticule().stepMinor([13, 13]))
            .attr('class', 'graticule')
            .attr('d', path);
    }


}
