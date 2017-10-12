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

var required_columns = ['Name', 'Continent', 'GDP', 'Life Expectancy', 'Population', 'Year']
var def_titles = ['name', 'continent', 'gdp', 'life_expectancy', 'population', 'year']
d3.json("data/countries_2012.json", function (error, data) {

    var columns = Object.keys(data[0]);
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
        })
        .on("click", function (header) {
            alert(header);
            headers.attr('class', 'header');
            if (sortAscending) {
                tbody.selectAll("tr").sort(function (a, b) {
                    sortAscending = false;
                    d3.select(header).attr('class', 'aes');
                    return d3.ascending(a[header], b[header]);
                });
            }
            else {
                tbody.selectAll("tr").sort(function (a, b) {
                sortAscending=true;
                this.className='des';
                return d3.descending(a[header], b[header]);

            });
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
        .text(function (d) {
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