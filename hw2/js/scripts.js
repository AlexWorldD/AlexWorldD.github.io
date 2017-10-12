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

var required_columns = ['Name', 'Continent', 'GDP', 'Life Expectancy', 'Population', 'Year'];
var def_titles = ['name', 'continent', 'gdp', 'life_expectancy', 'population', 'year'];
d3.json("data/countries_2012.json", function (error, data) {
    //var columns = Object.keys(data[0]);
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
    // column definitions
    // var columns1 = [
    //     { head: 'Name', cl: 'title', html: d3.f('Name') },
    //     { head: 'Continent', cl: 'center', html: d3.f('Continent') },
    //     { head: 'GPD', cl: 'num', html: d3.f('GPD', d3.format('$,.2s')) },
    //     { head: 'Life Expectancy', cl: 'num', html: d3.f('Life Expectancy', d3.format('.1f')) },
    //     { head: 'Population', cl: 'num', html: d3.f('Population', d3.format(',.0f')) },
    //     { head: 'Year', cl: 'num', html: d3.f('Year', d3.format('.0f')) }
    // ];
    var sortAscending = true;
    // Build a table. ~Empty table~
    var table = d3.select(".content").append("table"),
        thead = table.append("thead")
            .attr("class", "thead");
    tbody = table.append("tbody");

    table.append("caption")
        .html("World Countries Ranking");

    // Putting our data to table
    var headers = thead.append("tr").selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .text(function (d) {
            return d;
        });
    // headers.on('click', function (header) {
    //     headers.attr('class', 'header');
    //     if (sortAscending) {
    //         rows.sort(function(a, b) { return b[header] < a[header]; });
    //         sortAscending = false;
    //         this.className = 'aes';
    //     } else {
    //         rows.sort(function(a, b) { return b[header] > a[header]; });
    //         sortAscending = true;
    //         this.className = 'des';
    //     }
    // })
    headers.on("click", function (header) {
        headers.attr('class', 'header');
        if (sortAscending) {
            rows.sort(function (a, b) {
                sortAscending = false;
                var t = d3.ascending(a[header], b[header]);
                if (t==0 && header=='Continent') {
                    return d3.ascending(a['Name'], b['Name'])
                }
                else return t;
            });
            this.className = 'aes';
        }
        else {
            rows.sort(function (a, b) {
                sortAscending = true;
                var t = d3.descending(a[header], b[header]);
                if (t==0 && header=='Continent') {
                    // TODO or change to des too?
                    return d3.ascending(a['Name'], b['Name'])
                }
                else return t;

            });
            this.className = 'des';
        }});
    var rows = tbody.selectAll("tr.row")
        .data(data)
        .enter()
        .append("tr").attr("class", "row");

    var cells = rows.selectAll("td")
        .data(function (row) {
            return d3.range(Object.keys(row).length).map(function (column, i) {
                return row[Object.keys(row)[i]];
            });
        })
        .enter()
        .append("td")
        .html(function (d) {
            return d;
        })
        .on("mouseover", function (d, i) {

            d3.select(this.parentNode)
                .style("background-color", "#F3ED86");

        }).on("mouseout", function () {

            tbody.selectAll("tr")
                .style("background-color", null)
                .selectAll("td")
                .style("background-color", null);

        });

})
;