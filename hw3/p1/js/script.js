const my_color = colorbrewer.Blues[5];
// Load CSV file
d3.csv("data/fifa-world-cup.csv", function (error, allData) {
    allData.forEach(function (d) {
        // Convert numeric values to 'numbers'
        d.year = +d.YEAR;
        d.matches = +d.MATCHES;
        d.goals = +d.GOALS;
        d.avg_goals = +d.AVERAGE_GOALS;
        d.attendance = +d.AVERAGE_ATTENDANCE;
        // Lat and Lons of gold and silver medals teams
        d.win_pos = [+d.WIN_LON, +d.WIN_LAT];
        d.ru_pos = [+d.RUP_LON, +d.RUP_LAT];

        //Break up lists into javascript arrays
        d.teams_iso = d3.csvParse(d.TEAM_LIST).columns;
        d.teams_names = d3.csvParse(d.TEAM_NAMES).columns;
        d.teams = +d.teams_names.length;
    });
    window.allData = allData.reverse();
    /* Create infoPanel, barChart and Map objects  */
    window.infoPanel = new InfoPanel();
    window.worldMap = new Map();

    /* DATA LOADING */
    //Load in json data to make map
    // d3.json("data/world.json", function (error, world) {
    //     if (error) throw error;
    //     window.worldMap.drawMap(world);
    // });
    d3.json("data/countries.json", function (error, world) {
        if (error) throw error;
        window.worldMap.drawMap(world);
    });
    // Define this as a global variable
    window.barChart = new BarChart();

    // Draw the Bar chart for the first time
    // barChart.updateBarChart('attendance');
});

/**
 *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
 *
 *  There are 4 attributes that can be selected:
 *  goals, matches, attendance and teams.
 */
function chooseData() {
    // ******* TODO: PART I *******
    // Changed the selected data when a user selects a different
    // menu item from the drop down.
    window.barChart.update();

}
// var tip = d3.tip()
//     .attr('class', 'd3-tip')
//     // .offset([-10, 0])
//     .html(function(d) {
//         let result = getInfo(d);
//         let gold = "<circle class=\"gold\" r=\"6\"></circle>";
//         let silver = "<circle class=\"silver\" r=\"5\" ></circle>";
//         let res_html = "<ul>";
//         for (let cur in result.winner) {
//             res_html+="<li>"+cur+gold+"</li>"
//
//         }
//     });


function getInfo(cur, iso=false) {
    let result = {
        'winner': new Array(),
        'silver': new Array(),
        'part': new Array()
    };
    for (let it=0; it<window.allData.length; it++) {
        let d = window.allData[it];
        if (iso==false) {
            if (d.teams_names.includes(cur)) {
                if (d.winner == cur) {
                    result.winner.push(d.EDITION);
                }
                if (d.runner_up==cur) {
                    result.silver.push(d.EDITION)
                }
                else {
                    result.part.push(d.EDITION)
                }

            }
        }
        else {
            if (d.teams_iso.includes(cur)) {
                if (d.winner_code == cur) {
                    result.winner.push(d.EDITION);
                }
                if (d.runner_code==cur) {
                    result.silver.push(d.EDITION)
                }
                else {
                    result.part.push(d.EDITION)
                }

            }
        }

    }

    let gold = "<svg width=\"10\" height=\"10\"><circle class=\"gold\" cx=\"5\" cy=\"5\" r=\"4\"></circle></svg>";
    let silver = "<svg width=\"10\" height=\"10\"><circle class=\"silver\" cx=\"5\" cy=\"5\" r=\"4\"></circle></svg>";
    let blank = "<svg width=\"10\" height=\"10\"></svg>";
    let res_html = "<ul id=\"tip\">";
    for (let cur in result.winner) {
        res_html += "<li>" + gold + result.winner[cur] +  "</li>"
    }
    for (let cur in result.silver) {
        res_html += "<li>" + silver + result.silver[cur] +  "</li>"
    }
    for (let cur in result.part) {
        res_html += "<li>" + blank + result.part[cur] + "</li>"
    }
    res_html+="</ul>";
    if (res_html=="<ul id=\"tip\"></ul>") {
        res_html = 'Lionel Messi the Greatest Of All Time!';
    }
    return res_html;
        // <circle class="gold" cx="176" cy="12" r="8"></circle>
        // <circle class="silver" cx="258" cy="12" r="8" ></circle>
}


let tip = function (d, map=false) {
    // AWFULLL, but how I can do it on the other way...?
    if (map!==true) {
        map = false;
    }
    let div_tip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    div_tip.transition()
        .duration(200)
        .style("opacity", .95);
    d3.select("body").select('div.tooltip')
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY) + "px")
        .style("display", "inline-block")
        .html(getInfo(d, map));
};
