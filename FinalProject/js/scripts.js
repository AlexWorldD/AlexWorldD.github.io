// Setting interval for quotes change timing
$("#quotes_block").carousel({interval: 10000});
// Loading data from files
d3.json("data/D1_v2.json", function (error, data) {
    if (error) throw error;
    d3.json("data/Data4Map.json", function (error, map_data) {
        if (error) throw error;
        window.AllData = new data_manager(data, map_data);
        window.RuMap = new Map();
        // Adding map to our page
        d3.json("data/russia_1e-7sr.json", function (error, motherRussia) {
            if (error) throw error;
            window.RuMap.draw_map(motherRussia);
        });
        window.LineChart = new line_chart();
    });
    d3.selectAll('input[type=checkbox][name="group"]').on('change', function (d) {
        window.LineChart.update_groups();
        window.RuMap.update_map();
    });
    d3.select('#Encoding').on('change', function (d) {
        window.LineChart.update_encoding();
    });
    d3.select('#gender_select').on('change', function (d) {
        window.LineChart.update_encoding();
    });
});