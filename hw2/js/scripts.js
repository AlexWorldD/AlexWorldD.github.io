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
    // column definitions
    var columns1 = [
        {head: 'Name', cl: 'title', html: d3.f('Name')},
        {head: 'Continent', cl: 'center', html: d3.f('Continent')},
        {head: 'GDP', cl: 'num', html: d3.f('GDP', d3.format('$,.2s'))},
        {head: 'Life Expectancy', cl: 'num', html: d3.f('Life Expectancy', d3.format('.1f'))},
        {head: 'Population', cl: 'num', html: d3.f('Population', d3.format(',.0f'))},
        {head: 'Year', cl: 'center', html: d3.f('Year', d3.format('.0f'))}
    ];
    var sortAscending = true;
    // Build a table. ~Empty table~
    var table = d3.select(".table").append("table"),
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
            rows.sort(function (a, b) {
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
            rows.sort(function (a, b) {
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
    var rows = tbody.selectAll("tr.row")
        .data(data)
        .enter()
        .append("tr").attr("class", "row");

    var cells = rows
        .selectAll('td')
        .data(td_data)
        .enter()
        .append('td')
        .html(d3.f('html'))
        .attr('class', d3.f('cl'));

    cells
        .on("mouseover", function (d, i) {

            d3.select(this.parentNode)
                .style("background-color", "#ffb0bf");

        }).on("mouseout", function () {

        tbody.selectAll("tr")
            .style("background-color", null)
            .selectAll("td")
            .style("background-color", null);

    });

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

    // Set the trigger for our filtering
    d3.selectAll("input[type=checkbox]").on("change", filter_table);

    function filter_table() {
        var choices = [];
        var t_t = d3.selectAll("input[type=checkbox]").each(function (d) {
            var temp = d3.select(this);
            if (temp.property("checked")) {
                choices.push(temp.property("value"));
            };
        });
        var newData;
        if (choices.length > 0) {
            newData = req_data.filter(function (d, i) {
                return choices.includes(d.Continent);
            })
        }
        else {
            newData = req_data;
        }
        var update = function (new_data) {
            // Row selection for update
            n_rows = tbody.selectAll('tr.row').data(new_data);
            n_rows.exit()
                .transition()
                .delay(0)
                .duration(0)
                .style('opacity', 0.0)
                .remove();
            n_rows  = n_rows.enter()
                .append("tr").attr("class", "row").merge(n_rows);

            n_cells = n_rows
                .selectAll('td')
                .data(td_data);
            n_cells.exit()
                .transition()
                .delay(0)
                .duration(0)
                .style('opacity', 0.0)
                .remove();
            n_cells = n_cells
                .enter()
                .append('td')
                .html(d3.f('html'))
                .attr('class', d3.f('cl'))
                .merge(n_cells);

        }

        update(newData);
        // tbody.selectAll("tr.row").html('');
        // var newRows = tbody.selectAll("tr.row")
        //     .data(newData);
        // newRows
        //     .enter()
        //     .append("tr").attr("class", "row");
        //
        // newRows.exit().remove();
        // rows = newRows;
        // var cells = rows
        //     .appendMany(td_data, 'td')
        //     .html(d3.f('html'))
        //     .attr('class', d3.f('cl'));
        //
        // var newCells = rows.data(td_data);
        // newCells
        //     .enter()
        //     .append('td')
        //     .html(d3.f('html'))
        //     .attr('class', d3.f('cl'));
        // newCells.exit().remove();
        // cells = newCells;
        // cells.appendMany(td_data, 'td')
        //     .html(d3.f('html'))
        //     .attr('class', d3.f('cl'));
    }

})
;