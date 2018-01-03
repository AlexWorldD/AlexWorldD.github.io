//Global vars
let graph = {
    nodes: [],
    edges: []
};
let svg = d3.select('#graph');
let width = +d3.select('#graph').attr('width');
let height = +d3.select('#graph').attr('height');
let center = {x: window.innerWidth / 2, y: height / 2}
let simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id(function (d) {
        return d.id;
    }))
    .force('charge', d3.forceManyBody().strength(-100))
    .force('center', d3.forceCenter(center.x, center.y))
    .force('x', d3.forceX().strength(0.5).x(center.x))
    .force('y', d3.forceY().strength(0.5).y(center.y));

d3.json('data/countries_1995_2012.json', function (error, data) {
    if (error) throw error;
    // Okay, we didn't have any issues getting our data...

    // Getting our data for building pretty graph
    graph.nodes = data_prepare(data);
    graph.nodes.forEach(t => {
        t.Partners.forEach(
            _t => {
                graph.edges.push({
                    'source': t,
                    'target': graph.nodes.find(x => x.id == _t.country_id),
                    'value': _t.total_export
                })
            }
        )
    });
    // console.log(graph.edges);

    let edgeLayer = svg.append('g')
        .attr('class', 'links');
    // Now let's create the lines
    let links = edgeLayer.selectAll('.edge')
        .data(graph.edges)
        .enter().append('line')
        .attr('stroke-width', 1);
        // .attr('stroke-width', d => Math.sqrt(d.value));
    let nodeLayer = svg.append('g')
        .attr('class', 'nodes');
    let nodes = nodeLayer
        .selectAll('.node')
        .data(graph.nodes)
        .enter()
        .append('g')
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
        .attr("r", 5);

    console.log(graph);

    simulation.nodes(graph.nodes);
    // simulation.force("link")
    //     .links(graph.edges);

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

});


// Ctrl+C & Ctrl+V from https://codepen.io/_avt_/pen/rGQQPw?editors=1000
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

// Function for preparing Data according natural language titles of columns
function data_prepare(data) {
    return data.map(function (t) {
            // Take data just for specific data... for example,. 2010
            let _cur = t.years.find(_t => _t.year === 2010);
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
                'x': window.innerWidth / 4 + 2 * window.innerWidth * Math.random() / 4,
                'y': height / 4 + 2 * height * Math.random() / 4
                // 'x': 0,
                // 'y': 0
            }
        }
    )
}
