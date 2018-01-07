//Global vars
let graph = {
    nodes: [],
    links: []
};
let svg = d3.select('#graph');
let margin = {top: 20, bottom: 10, left: 10, right: 10};
let width = 1280 - margin.left - margin.right;
let height = 1280 - margin.top - margin.bottom;
svg
    .attr('width', width)
    .attr('height', height);
let center = {x: width / 2, y: height / 4};
let simulation = d3.forceSimulation()
    .force('charge', d3.forceManyBody().strength(-100))
    .force('x', d3.forceX().strength(0.2).x(center.x))
    .force('y', d3.forceY().strength(0.2).y(center.y));
// .force('link', d3.forceLink().id(function (d) {
//     return d.id;
// }))
// .force('charge', d3.forceManyBody().strength(-100))
// .force('center', d3.forceCenter(center.x, center.y))

let node_radius = 7;
let encoding = 'None';
let ranking = false;
let coordinates = 'geo';
let global_l = 'force';
let local_l = 'none';
let continents = {
    'Africa': 'dot_africa',
    'Americas': 'dot_americas',
    'Europe': 'dot_europe',
    'Asia': 'dot_asia',
    'Oceania': 'dot_oceania'
};
d3.json('data/countries_1995_2012.json', function (error, data) {
    if (error) throw error;

    // Getting our data for building pretty graph
    graph.nodes = data_prepare(data);
    graph.nodes.forEach(t => {
        t.Partners.forEach(
            _t => {
                let target = graph.nodes.find(x => x.id === _t.country_id);
                if (target == undefined) {
                    console.log(t.Name);
                }
                graph.links.push({
                    'source': t,
                    'target': target,
                    'value': _t.total_export
                })
            }
        )
    });

    let linkLayer = svg.append('g')
        .attr('class', 'links');
    // Now let's create the lines
    let links = linkLayer.selectAll('.link')
        .data(graph.links)
        .enter()
        .append('line');
    // .attr('stroke-width', d => Math.sqrt(d.value));
    let nodeLayer = svg.append('g')
        .attr('class', 'nodes');
    let nodes = nodeLayer
        .selectAll('.node')
        .data(graph.nodes)
        .enter()
        .append('g')
        .classed('node', true)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
    // TODO add hover function

    // Add labels to the nodes
    nodes.append('text')
        .attr("dx", "10")
        .attr("dy", "5")
        .text(d => d.Name)
        .attr("class", 'label_node');
    nodes.append('circle')
        .attr("class", "dot_node")
        .attr('r', node_radius);

    function graph_update(duration = 0) {

        links.transition().duration(duration)
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        nodes.transition().duration(duration)
            .attr("transform", function (d, i) {
                return "translate(" + d.x + "," + d.y + ")";
            });
    }

    let geo_scale = {
        'X': d3.scaleLinear()
            .domain([d3.min(graph.nodes, d => d['Longitude']),
                d3.max(graph.nodes, d => d['Longitude'])])
            .range([30, 1200]),
        'Y': d3.scaleLinear()
            .domain([d3.min(graph.nodes, d => d['Latitude']),
                d3.max(graph.nodes, d => d['Latitude'])])
            .range([900, 30])
    };
    let pop_scale = {
        'X': d3.scaleLinear()
            .domain([d3.min(graph.nodes, d => d['GDP']),
                d3.max(graph.nodes, d => d['GDP'])])
            .range([30, 1100]),
        'Y': d3.scaleLinear()
            .domain([d3.min(graph.nodes, d => d['Population']),
                d3.max(graph.nodes, d => d['Population'])])
            .range([900, 30])
    };
    // Ctrl+C & Ctrl+V from https://codepen.io/_avt_/pen/rGQQPw?editors=1000
    // TODO fix dragging
    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    simulation.nodes(graph.nodes)
        .on('tick', graph_update);
    // simulation.force("link")
    //     .links(graph.links);

    draw_list();

    // TODO refactoring below>>>
    // simulation.on("tick", _ => {
    //     // links
    //     //     .attr("x1", d => d.source.x)
    //     //     .attr("y1", d => d.source.y)
    //     //     .attr("x2", d => d.target.x)
    //     //     .attr("y2", d => d.target.y);
    //     // nodes
    //     //     .attr("cx", d => d.x)
    //     //     .attr("cy", d => d.y)
    //     // text
    //     //     .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    // });
    function draw_list() {
        simulation.stop();
        if (!ranking || (ranking && encoding === 'None')) {
            if (encoding !== 'None') {
                graph.nodes.sort((a, b) => d3.descending(a[encoding], b[encoding]));
            }
            else {
                graph.nodes.sort((a, b) => d3.ascending(a['Name'], b['Name']));
            }

            graph.nodes.forEach((d, i) => {
                d.x = 20;
                d.y = node_radius * 3 * i;
            });
            let new_height = node_radius * graph.nodes.length * 3 + 100;
            svg
                .attr('height', new_height);
        }
        else {
            if (encoding !== 'None') {
                let scale = d3.scaleLinear()
                    .domain([0, d3.max(graph.nodes, d => d[encoding])])
                    .range([height, 10]);
                graph.nodes.forEach((d, i) => {
                    d.x = 20;
                    d.y = scale(d[encoding]);
                });
                svg
                    .attr('height', height + 20);
            }
        }
        graph_update(999);

    }

    function draw_scatter() {
        simulation.stop();
        if (coordinates === 'geo') {
            graph.nodes.forEach((d, i) => {
                d.x = geo_scale.X(d['Longitude']);
                d.y = geo_scale.Y(d['Latitude'])
            });

        }
        if (coordinates === 'pop_gdp') {
            graph.nodes.forEach((d, i) => {
                d.x = pop_scale.X(d['GDP']);
                d.y = pop_scale.Y(d['Population'])
            });
        }
        svg
            .attr('height', 900 + 20);
        graph_update(999);
    }

    function draw_mix() {
        let continent_centers = {
            'Africa': {x: 0, y: 0},
            'Americas': {x: 0, y: 0},
            'Europe': {x: 0, y: 0},
            'Asia': {x: 0, y: 0},
            'Oceania': {x: 0, y: 0},
        };
        // PATCH zone:
        let cur_width = Math.min(window.innerWidth, width);
        let cur_height = Math.min(window.innerHeight, height);
        if (local_l === 'force') {
            continent_centers = {
                'Africa': {x: cur_width / 6, y: height / 4},
                'Americas': {x: cur_width / 3, y: height / 4},
                'Europe': {x: cur_width / 2, y: height / 4},
                'Asia': {x: 2 * cur_width / 3, y: height / 4},
                'Oceania': {x: 5 * cur_width / 6, y: height / 4},
            };
        }
        if (global_l === 'circular') {
            let r = Math.min(cur_width, cur_height) / 2 - 100;
            let arc = d3.arc()
                .outerRadius(r);
            let pie = d3.pie()
                .value((d, i) => 1);
            pie(['Africa', 'Americas', 'Europe', 'Asia', 'Oceania']).map((d, i) => {
                d.innerRadius = 0;
                d.outerRadius = r;
                d.x = arc.centroid(d)[0] + cur_width / 2;
                d.y = arc.centroid(d)[1] + r + 50;
                continent_centers[d.data] = {x: d.x, y: d.y};
            });

        }
        //    TODO add patch for group position
        if (global_l === 'force') {
            if (local_l === 'none') {
                simulation.force('x', d3.forceX().strength(0.15).x(Math.min(window.innerWidth / 2, center.x)));
                simulation.force('y', d3.forceY().strength(0.15).y(center.y));
                svg
                    .attr('height', height / 2 + 20);
            }
            else {
                simulation.force('x', d3.forceX().strength(0.15).x(d => continent_centers[d.Continent].x));
                simulation.force('y', d3.forceY().strength(0.15).y(d => continent_centers[d.Continent].y));
                svg
                    .attr('height', 2 * height / 3);
            }
            simulation.alpha(1).restart();
        }
        else {
            if (local_l === 'force') {
                simulation.force('x', d3.forceX().strength(0.15).x(d => continent_centers[d.Continent].x));
                simulation.force('y', d3.forceY().strength(0.15).y(d => continent_centers[d.Continent].y));
                svg
                    .attr('height', 3 * height / 4);
                simulation.alpha(1).restart();
            }
            if (local_l === 'none') {
                simulation.stop();
                let r = Math.min(cur_width, cur_height)*0.66;
                let arc = d3.arc()
                    .outerRadius(r);
                let column = encoding === 'None' ? 'Name' : encoding;

                let pie;
                if (ranking) {
                    pie = d3.pie()
                        .sort((a, b) => a[column] - b[column])
                        .value((d, i) => 1);
                }
                else {
                    pie = d3.pie()
                        .value((d, i) => 1);
                }
                graph.nodes = pie(graph.nodes).map((d,i) => {
                    d.innerRadius = 0;
                    d.outerRadius = r;
                    d.data.x = arc.centroid(d)[0] + cur_width / 2 -30;
                    d.data.y = arc.centroid(d)[1] + r/2 + 20;
                    return d.data;
                });
                svg
                    .attr('height', 2*height/3);
                graph_update(999);
            }

        }

    }

    get_encode();
    //    ----------
    // Additional functions
    // Table-Bar switcher
    d3.selectAll('input[type=radio][name="mode"]').on("change", update_filters);
    d3.selectAll('input[type=radio][name="coordinates"]').on("change", update_vis);
    d3.selectAll('input[type=radio][name="global_l"]').on("change", update_vis);
    d3.selectAll('input[type=radio][name="group_l"]').on("change", update_vis);
    d3.select('#Encoding').on("change", update_vis);
    d3.select('input[type=checkbox][name="Rank"]').on('change', update_vis);
    d3.selectAll('input[type=radio][name="coloring"]').on("change", update_color);

    function update_filters() {
        let cur_page = d3.select('input[name="mode"]:checked').node().value;
        if (cur_page === 'mix') {
            d3.select('#mix_filters').style("display", "block");
        }
        else {
            d3.select('#mix_filters').style("display", "none");
        }
        if (cur_page === 'scatter') {
            d3.select('#scatter_filters').style("display", "block");
        }
        else {
            d3.select('#scatter_filters').style("display", "none");
        }
        update_vis();
    }

    function update_color() {
        let color = d3.select('input[name="coloring"]:checked').node().value;
        if (color === 'byContinent') {
            nodes.selectAll('circle')
                .transition()
                .duration(500)
                .attr('class', d => continents[d.Continent] + ' dot_node');
        }
        else {
            nodes.selectAll('circle')
                .transition()
                .duration(500)
                .attr('class', 'dot_node')
        }
    }

    function get_encode() {
        // Getting encode parameters from imput form
        ranking = d3.select('input[type=checkbox][name="Rank"]').node().checked;
        encoding = d3.select('#Encoding').node().value;
        coordinates = d3.select('input[name="coordinates"]:checked').node().value;
        global_l = d3.selectAll('input[name="global_l"]:checked').node().value;
        local_l = d3.selectAll('input[name="group_l"]:checked').node().value;
    }

    function update_vis() {
        let cur_page = d3.select('input[name="mode"]:checked').node().value;
        get_encode();
        switch (cur_page) {
            case "list":
                draw_list();
                break;
            case 'scatter':
                draw_scatter();
                break;
            case 'mix':
                draw_mix();
        }
    }
});


// Function for preparing Data according natural language titles of columns
function data_prepare(data) {
    return data.map(function (t) {
            // Take data just for specific data... for example,. 2010
            let _cur = t.years.find(_t => _t.year === 2012);
            return {
                'Name': t.name,
                'id': t.country_id,
                'Code': t.alpha2_code,
                'Continent': t.continent,
                'Latitude': t.latitude,
                'Longitude': t.longitude,
                'GDP': _cur.gdp,
                'Life Expectancy': _cur.life_expectancy,
                'Population': _cur.population,
                'Partners': _cur.top_partners,
                //    Specific vars for graph structure:
                // 'x': window.innerWidth / 4 + 2 * window.innerWidth * Math.random() / 4,
                // 'y': height / 4 + 2 * height * Math.random() / 4
                'x': 0,
                'y': 0
            }
        }
    )
}




