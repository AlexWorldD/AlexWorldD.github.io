// let daily_threshold = [5, 10, 25, 50, 100];
let daily_threshold = [0.02, 0.03, 0.04, 0.05, 0.065];
let total_threshold = [0, 900, 2300, 5000, 15000, 50000];
let color_domain = total_threshold.slice(1);
let color_domain2 = daily_threshold.slice(1);
const colors = {
    'Space_Live': 'steelblue',
    'O_Cosmose': '#67b461',
    'Ros_Cosmos': '#c2642b',
    'V_Cosmose': '#c366da'
};
// ATTENTION!! x2 code foe better performance, cause we won't built interpolate function every mouse moving
function color_holds(a, b) {
    let color = d3.scaleLinear().domain([1,total_threshold.length])
        .interpolate(d3.interpolateHcl)
        .range([d3.rgb(a), d3.rgb(b)]);
    return total_threshold.map(t=>color(total_threshold.indexOf(t)));
}
function coloring(args) {
    if (args[0] === 'Def') {
        return '#e3e3e3';
    }
    else {
        switch (args[0]) {
            case 'Space_Live':
                return d3.scaleThreshold()
                    // .range(d3.schemeBlues[total_threshold.length])
                    .range(color_holds('#4682B4', '#4eb8f0'))
                    .domain(color_domain)(args[1]);
            case 'O_Cosmose':
                return d3.scaleThreshold()
                    .range(color_holds('#67b461', '#94eb8e'))
                    .domain(color_domain)(args[1]);
            case 'Ros_Cosmos':
                return d3.scaleThreshold()
                    .range(color_holds('#c2642b', '#ee862e'))
                    .domain(color_domain)(args[1]);
            case 'V_Cosmose':
                return d3.scaleThreshold()
                    .range(color_holds('#c366da', '#de79f2'))
                    .domain(color_domain)(args[1])
        }
    }
}
// Double HERE:
function daily_color_holds(a, b) {
    let color = d3.scaleLinear().domain([1,daily_threshold.length])
        .interpolate(d3.interpolateHcl)
        .range([d3.rgb(a), d3.rgb(b)]);
    return daily_threshold.map(t=>color(daily_threshold.indexOf(t)));
}
function daily_coloring(args) {
    if (args[0] === 'Def') {
        return '#e3e3e3';
    }
    else {
        switch (args[0]) {
            case 'Space_Live':
                return d3.scaleThreshold()
                    .range(daily_color_holds('#4682B4', '#4eb8f0'))
                    .domain(color_domain2)(args[1]);
            case 'O_Cosmose':
                return d3.scaleThreshold()
                    .range(daily_color_holds('#67b461', '#94eb8e'))
                    .domain(color_domain2)(args[1]);
            case 'Ros_Cosmos':
                return d3.scaleThreshold()
                    .range(daily_color_holds('#c2642b', '#ee862e'))
                    .domain(color_domain2)(args[1]);
            case 'V_Cosmose':
                return d3.scaleThreshold()
                    .range(daily_color_holds('#c366da', '#de79f2'))
                    .domain(color_domain2)(args[1])
        }
    }
}
// -------- MAP class actually -------

class Map {
    constructor() {
        this.projection = d3.geoAlbers()
            .rotate([-105, 0])
            .center([-10, 65])
            .parallels([32, 64])
            .scale(650)
            .translate([450, 240]);
        this.map = d3.select('svg#ru_map')
            .append('g')
            .attr('id', 'map');
        this.points = d3.select('svg#ru_map')
            .append('g')
            .attr('id', 'points');
    }
    draw_map(motherRussia) {
        const cities_list = [
            {'City': 'Moscow',	'lat': 55.7522200,	'lon': 37.6155600},
            {'City': 'Saint Petersburg',	'lat': 59.8944400,	'lon': 30.2641700},
            {'City': 'Perm',	'lat': 58.0000000,	'lon': 56.2500000},
            {'City': 'Krasnoyarsk',	'lat': 56.0097200,	'lon': 92.7916700},
            {'City': 'Kazan',	'lat': 55.7877000,	'lon': 49.1248000},
            {'City': 'Omsk',	'lat': 55.0000000,	'lon': 73.4000000},
            {'City': 'Ufa',	'lat': 54.7750000,	'lon': 56.0375000}
        ];
        // First of all create var with converter from GEOJson to string for svg
        let path = d3.geoPath()
            .projection(this.projection);
        let regions = topojson.feature(motherRussia, motherRussia.objects.russia).features;
        this.map.selectAll('path')
            .data(regions)
            .enter()
            .append('path')
            .classed('regions', true)
            .attr('id', d => d.properties.region)
            .attr('d', path)
            .transition()
            .duration(500)
            .style('fill', d=> coloring(get_color4map(d.properties.region)));
        let cities = this.points.selectAll('g')
            .data(cities_list)
            .enter()
            .append('g')
            .attr('transform', d=> 'translate(' + this.projection([d.lon, d.lat]) + ')')
            .attr('class', 'city');
        cities.append('circle')
            .attr('r', 2)
            .style('fill', 'white');
        cities.append('text').attr('class', 'shade');
        cities.append('text');
        cities.selectAll('text')
            .text(d=> d.City);
    }
    update_map() {
        this.map.selectAll('path')
            .transition()
            .duration(500)
            .style('fill', d=> coloring(get_color4map(d.properties.region)));
    }
    daily_update(date) {
        this.map.selectAll('path')
            .transition()
            .duration(500)
            .style('fill', d=> daily_coloring(update_color4map(d.properties.region, date)));
    }
}