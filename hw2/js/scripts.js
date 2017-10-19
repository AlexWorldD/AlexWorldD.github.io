function f(){
    var functions = arguments;

    //convert all string arguments into field accessors
    var i = 0, l = functions.length;
    while (i < l) {
        if (typeof(functions[i]) === 'string' || typeof(functions[i]) === 'number'){
            functions[i] = (function(str){ return function(d){ return d[str]; }; })(functions[i]);
        }
        i++;
    }

    //return composition of functions
    return function(d) {
        var i=0, l = functions.length;
        while (i++ < l) d = functions[i-1].call(this, d);
        return d;
    };
}

f.not = function(d){ return !d; };
f.run = function(d){ return d(); };
f.objToFn = function(obj, defaultVal){
    if (arguments.length == 1) defaultVal = undefined;

    return function(str){
        return typeof(obj[str]) !== undefined ? obj[str] : defaultVal;
    };
};

let req_data;
// column definitions
const columns = [
    {head: 'Name', cl: 'title', html: f('Name')},
    {head: 'Continent', cl: 'center', html: f('Continent')},
    {head: 'GDP', cl: 'num', html: f('GDP', d3.format('$,.2s'))},
    {head: 'Life Expectancy', cl: 'center', html: f('Life Expectancy', d3.format('.1f'))},
    {head: 'Population', cl: 'num', html: f('Population', d3.format(',.0f'))},
    {head: 'Year', cl: 'center', html: f('Year', d3.format('.0f'))}
];

function td_data(row, i) {
    return columns.map(function (c) {
        // compute cell values for this specific row
        const cell = {};
        d3.keys(c).forEach(function (k) {
            cell[k] = typeof c[k] == 'function' ? c[k](row, i) : c[k];
        });
        return cell;
    });
}

// Function for styling table with HOVER-actions.
function make_pretty() {
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

// Function for preparing Data according natural language titles of columns
function data_prepare(data) {
    return data.map(function (t) {
        return {
            'Name': t.name,
            'Continent': t.continent,
            'Years': t.years.map(function (d) {
                return {
                    'GDP': d.gdp,
                    'Life Expectancy': d.life_expectancy,
                    'Population': d.population,
                    'Year': d.year
                }

            })
        };
    });
}

// Function for getting required Year split of Data
function req_year(data, year) {
    const y = d3.select('input[type=range]').node().valueAsNumber;
    if (data === undefined) {
        data = req_data;
    }
    if (year === undefined) {
        year = y;
    }
    return data.map(function (t) {
        return {
            'Name': t.Name,
            'Continent': t.Continent,
            'GDP': t.Years[year - 1995].GDP,
            'Life Expectancy': t.Years[year - 1995]['Life Expectancy'],
            'Population': t.Years[year - 1995].Population,
            'Year': year
        }
    });
}

// Function for styling header of table with Up/Down rows.
function sort() {
    let h_aes = d3.select('.aes');
    let h_des = d3.select('.des');
    if (!h_aes.empty()) {
        h_aes = h_aes.data()[0];
        tbody.selectAll("tr.row").sort(function (a, b) {
            const t = d3.ascending(a[h_aes.head], b[h_aes.head]);
            if (t == 0 && h_aes.head == 'Continent') {
                return d3.ascending(a['Name'], b['Name'])
            }
            else return t;
        });
    }
    else {
        if (!h_des.empty()) {
            h_des = h_des.data()[0];
            tbody.selectAll("tr.row").sort(function (a, b) {
                const t = d3.descending(a[h_des.head], b[h_des.head]);
                if (t == 0 && h_des.head == 'Continent') {
                    // TODO or change to des too?
                    return d3.ascending(a['Name'], b['Name'])
                }
                else return t;

            });
        }
    }
}

//    Function for building TABLE
function get_table(data) {
    let sortAscending = true;
    // Build a table. ~Empty table~
    const table = d3.select(".table").append("table")
            .attr("class", "fixed"),
        thead = table.append("thead")
            .attr("class", "thead");
    tbody = table.append("tbody");

    table.append("caption")
        .html("World Countries Ranking");

    // Putting our data to table
    const headers = thead.append("tr").selectAll("th")
        .data(columns)
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
                const t = d3.ascending(a[header.head], b[header.head]);
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
                const t = d3.descending(a[header.head], b[header.head]);
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
        .html(f('html'))
        .attr('class', f('cl'));
    make_pretty();
    const t1 = tbody.selectAll('tr.row').selectAll('td');
}

// Function for building BAR
function get_bar(data) {
    const canvas = d3.select('.bar')
        .append('svg')
        .attr('width', 700)
        .attr('height', 2800);

    let svg = d3.select("svg"),
        margin = {top: 20, right: 10, bottom: 20, left: 120},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    let x = d3.scaleLinear().range([0, width]),
        y = d3.scaleBand().rangeRound([0, height]).padding(0.1);

    const g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let cur_dim = d3.select('input[name="encode"]:checked').node().value;

    let max = d3.max(data, function (d) { return d[cur_dim]; });

    y.domain(data.map(function(d) { return d.Name; }));
    x.domain([0, max]);

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(5));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).tickSize(4));
        // .append("text")
        // .attr("transform", "rotate(-90)")
        // .attr("y", 0 - margin.left)
        // .attr("x",0 - (height / 2))
        // .attr("dy", "1em")
        // .style("text-anchor", "middle")
        // .text("Value");

    g.selectAll(".bar_chart")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar_chart")
        .attr("x", function(d) { return x(0); })
        .attr("y", function(d) { return y(d.Name); })
        .attr("width", function(d) { return x(d[cur_dim]); })
        .attr("height", y.bandwidth());

}

d3.json("data/countries_1995_2012.json", function (error, data) {

    req_data = data_prepare(data);
    data = req_year(req_data);

    // --------TABLE--------
    get_table(data);

    // --------BAR CHART--------
    get_bar(data);

});

// Set the trigger for our filtering
d3.selectAll("input[type=checkbox]").on("change", filter_table);

const update = function (new_data) {
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

    const temp = tbody.selectAll('td').data();
    tbody.selectAll('td').html(f('html'))
        .attr('class', f('cl'));
};

const update2 = function (new_data) {
    // Row selection for update
    let new_rows = tbody.selectAll('tr.row').data(new_data);
    new_rows
        .exit()
        .remove();
    new_rows = new_rows
        .enter()
        .append("tr").attr("class", "row").merge(new_rows);

    let n_cells = new_rows
        .selectAll('td')
        .data(td_data);

    n_cells.exit()
        .remove();
    n_cells = n_cells
        .enter()
        .append('td');

    const temp = tbody.selectAll('td').data();

    tbody.selectAll('td').html(f('html'))
        .attr('class', f('cl'));
};

function filter_data(data) {
    if (data === undefined) {
        data = req_year(req_data, 2008);
    }
    const choices = [];
    const t_t = d3.selectAll("input[type=checkbox]").each(function (d) {
        const temp = d3.select(this);
        if (temp.property("checked")) {
            choices.push(temp.property("value"));
        }
    });
    let newData;
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
    if (data === undefined) {
        data = req_year(req_data, 2008);
    }
    const agg = d3.select('input[name="aggregation"]:checked').node().value;
    let n;
    if (agg == "byContinent") {
        const nests = d3.nest()
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
        const conv = function (d) {
            const tmp = [];
            for (let it = 0; it < d.length; it++) {
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
    update2(aggregate_data(filter_data(req_year())));
    sort();
    const temp = tbody.selectAll('td').data();
    make_pretty();
}

d3.selectAll('input[name="aggregation"]').on("change", aggregate_table);

function aggregate_table() {
    update2(filter_data(aggregate_data(req_year())));
    sort();
    make_pretty();
}

d3.selectAll("input[type=range]").on("change", year_slider);

function year_slider() {
    update2(filter_data(aggregate_data(req_year())));
    sort();
    make_pretty();
}

// Table-Bar switcher
d3.selectAll('input[type=radio][name="toggle"]').on("change", switch_pages);

function switch_pages() {
    let cur_page = d3.select('input[name="toggle"]:checked').node().value;
    if (cur_page == 'Table') {
        d3.select('.table').style("display", "block");
        d3.select('.bar').style("display", "none");
        d3.select('#bar_filter').style("display", "none");
    }
    else {
        d3.select('.table').style("display", "none");
        d3.select('.bar').style("display", "block");
        d3.select('#bar_filter').style("display", "block");
    }
    let test = d3.select('.table');
}