//'use strict';
// alpha2_code
//     :
//     "sy"
// continent
//     :
//     "Asia"
// gdp
//     :
//     0
// latitude
//     :
//     33.5146
// life_expectancy
//     :
//     74.7107073170732
// longitude
//     :
//     36.3119
// name
//     :
//     "Syrian Arab Republic"
// population
//     :
//     14338240
// year
//     :
//     2012

var req_data;

// column definitions
var columns1 = [
    {head: 'Name', cl: 'title', html: d3.f('Name')},
    {head: 'Continent', cl: 'center', html: d3.f('Continent')},
    {head: 'GDP', cl: 'num', html: d3.f('GDP', d3.format('$,.2s'))},
    {head: 'Life Expectancy', cl: 'center', html: d3.f('Life Expectancy', d3.format('.1f'))},
    {head: 'Population', cl: 'num', html: d3.f('Population', d3.format(',.0f'))},
    {head: 'Year', cl: 'center', html: d3.f('Year', d3.format('.0f'))}
];

function td_data(row, i) {
    return columns1.map(function (c) {
        // compute cell values for this specific row
        var cell = {};
        d3.keys(c).forEach(function (k) {
            cell[k] = typeof c[k] == 'function' ? c[k](row, i) : c[k];
        });
        return cell;
    });
}

function make_pretty(){
    d3.select('tbody').selectAll("tr.row")
        .selectAll('td')
        .on("mouseover", function (d, i) {

            d3.select(this.parentNode)
                .style("background-color", "#ffb0bf");

        }).on("mouseout", function () {
        tbody.selectAll("tr")
            .style("background-color", null)
            .selectAll("td")
            .style("background-color", null);

    });
}
var required_columns = ['Name', 'Continent', 'GDP', 'Life Expectancy', 'Population', 'Year'];
var def_titles = ['name', 'continent', 'gdp', 'life_expectancy', 'population', 'year'];
d3.json("data/countries_2012.json", function (error, data) {
    var columns = required_columns;
    // TODO such an awful code... but should work.
    data = data.map(function (t) {
        return {
            'Name': t.name,
            'Continent': t.continent,
            'GDP': t.gdp,
            'Life Expectancy': t.life_expectancy,
            'Population': t.population,
            'Year': t.year
        };
    });
    req_data = data;

    var sortAscending = true;
    // Build a table. ~Empty table~
    var table = d3.select(".table").append("table")
            .attr("class", "fixed"),
        thead = table.append("thead")
            .attr("class", "thead");
    tbody = table.append("tbody");

    table.append("caption")
        .html("World Countries Ranking");

    // Putting our data to table
    var headers = thead.append("tr").selectAll("th")
        .data(columns1)
        .enter()
        .append("th")
        .text(function (d) {
            return d.head;
        });

    // Build an empty table with headers
    headers.on("click", function (header) {
        headers.attr('class', 'header');
        if (sortAscending) {
            tbody.selectAll("tr.row").sort(function (a, b) {
                sortAscending = false;
                var t = d3.ascending(a[header.head], b[header.head]);
                if (t == 0 && header.head == 'Continent') {
                    return d3.ascending(a['Name'], b['Name'])
                }
                else return t;
            });
            this.className = 'aes';
        }
        else {
            tbody.selectAll("tr.row").sort(function (a, b) {
                sortAscending = true;
                var t = d3.descending(a[header.head], b[header.head]);
                if (t == 0 && header.head == 'Continent') {
                    // TODO or change to des too?
                    return d3.ascending(a['Name'], b['Name'])
                }
                else return t;

            });
            this.className = 'des';
        }
    });

    // Start putting our data to table
    tbody.selectAll("tr.row")
        .data(data)
        .enter()
        .append("tr").attr("class", "row");
    tbody.selectAll("tr.row")
        .selectAll('td')
        .data(td_data)
        .enter()
        .append('td')
        .html(d3.f('html'))
        .attr('class', d3.f('cl'));
    make_pretty();
    var t1 = tbody.selectAll('tr.row').selectAll('td');

});

// Set the trigger for our filtering
d3.selectAll("input[type=checkbox]").on("change", filter_table);

var update = function (new_data) {
    // Row selection for update
    n_rows = tbody.selectAll('tr.row').data(new_data);

    n_rows.exit()
        .transition()
        .delay(900)
        .duration(200)
        .style('opacity', 0.0)
        .remove();

    n_rows = n_rows.enter()
        .append("tr").attr("class", "row")
        .style('opacity', 0.0)
        .transition()
        .delay(900)
        .duration(500)
        .style('opacity', 1.0)
        .merge(n_rows);

    n_cells = n_rows
        .selectAll('td')
        .data(td_data);
    n_cells.exit()
        .transition()
        .delay(200)
        .duration(500)
        .style('opacity', 0.0)
        .remove();
    n_cells = n_cells
        .enter()
        .append('td')
        .style('opacity', 0.0)
        .transition()
        .delay(900)
        .duration(500)
        .style('opacity', 1.0);

    var temp = tbody.selectAll('td').data();
    tbody.selectAll('td').html(d3.f('html'))
        .attr('class', d3.f('cl'));
};

var update2 = function (new_data) {
    // Row selection for update
    var new_rows = tbody.selectAll('tr.row').data(new_data);
    new_rows
        .exit()
        .remove();
    new_rows = new_rows
        .enter()
        .append("tr").attr("class", "row").merge(new_rows);

    var n_cells = new_rows
        .selectAll('td')
        .data(td_data);

    n_cells.exit()
        .remove();
    n_cells = n_cells
        .enter()
        .append('td');

    var temp = tbody.selectAll('td').data();

    tbody.selectAll('td').html(d3.f('html'))
        .attr('class', d3.f('cl'));
};

function filter_data(data) {
    if (data===undefined) {
        data = req_data;
    }
    var choices = [];
    var t_t = d3.selectAll("input[type=checkbox]").each(function (d) {
        var temp = d3.select(this);
        if (temp.property("checked")) {
            choices.push(temp.property("value"));
        }
    });
    var newData;
    if (choices.length > 0) {
        newData = data.filter(function (d, i) {
            return choices.includes(d.Continent);
        })
    }
    else {
        newData = data;
    }
    return newData;

}

function aggregate_data(data) {
    if (data===undefined) {
        data = req_data;
    }
    var agg = d3.select('input[name="agregation"]:checked').node().value;
    var n;
    if (agg == "byContinent") {
        var nests = d3.nest()
            .key(function (d) {
                return d.Continent
            })
            .rollup(function (d) {
                return {
                    'Name': d[0].Continent,
                    'Continent': d[0].Continent,
                    'GDP': d3.sum(d, function (g) {
                        return +g.GDP;

                    }),
                    'Life Expectancy': d3.mean(d, function (g) {
                        return +g['Life Expectancy'];

                    }),
                    'Population': d3.sum(d, function (g) {
                        return +g.Population;

                    }),
                    'Year': d[0].Year

                };

            })
            .entries(data);
        var conv = function (d) {
            var tmp = [];
            for (var it = 0; it < d.length; it++) {
                tmp.push(d[it].value)
            }
            return tmp;

        };
        n = conv(nests);
        return n;

    }
    else {
        return data;
    }

}

function filter_table() {
    update2(aggregate_data(filter_data()));
    d3.selectAll('th').attr('class', "header");
    make_pretty();
}

d3.selectAll("input[type=radio]").on("change", aggregate_table);

// 'Name': t.name,
//     'Continent': t.continent,
//     'GDP': t.gdp,
//     'Life Expectancy': t.life_expectancy,
//     'Population': t.population,
//     'Year': t.year
function aggregate_table() {
    update2(filter_data(aggregate_data()));
    d3.selectAll('th').attr('class', "header");
    make_pretty();
}
