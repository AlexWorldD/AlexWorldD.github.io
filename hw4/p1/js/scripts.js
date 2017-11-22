//Global vars
let graph = {
    nodes: [],
    edges: []
};
window.width = +d3.select('#graph').attr('width');
window.height = +d3.select('#graph').attr('height');
d3.json("data/countries_1995_2012.json", function (error, data) {

    // Getting our data for building pretty graph
    graph.nodes = data_prepare(data);
    graph.nodes.forEach(t => {
        t.Partners.forEach(
            _t => {
                graph.edges.push({
                    'source': t,
                    'target': graph.nodes.find(x => x.ID == _t.country_id)
                })
            }
        )
    });
    console.log(graph.edges)
});

// Function for preparing Data according natural language titles of columns
function data_prepare(data) {
    return data.map(function (t) {
            // Take data just for specific data... for example,. 2010
            let _cur = t.years.find(_t => _t.year === 2010);
            return {
                'Name': t.name,
                'ID': t.country_id,
                'Code': t.alpha2_code,
                'Continent': t.continent,
                'Latitude': t.latitude,
                'Longitude': t.longitude,
                'GDP': _cur.gdp,
                'Life Expectancy': _cur.life_expectancy,
                'Population': _cur.population,
                'Partners': _cur.top_partners,
                //    Specific vars for graph structure:
                'X': window.innerWidth / 4 + 2 * window.innerWidth * Math.random() / 4,
                'Y': window.height / 4 + 2 * window.height * Math.random() / 4
            }
        }
    )
}
