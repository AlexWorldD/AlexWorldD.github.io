/**
 * Loads in the table information from fifa-matches.json
 */
// d3.json('data/fifa-matches.json',function(error,data){
//
//     /**
//      * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
//      *
//      */
//     d3.csv("data/fifa-tree.csv", function (error, csvData) {
//
//         //Create a unique "id" field for each game
//         csvData.forEach(function (d, i) {
//             d.id = d.Team + d.Opponent + i;
//         });
//
//         //Create Tree Object
//         let tree = new Tree();
//         tree.createTree(csvData);
//
//         //Create Table Object and pass in reference to tree object (for hover linking)
//         let table = new Table(data,tree);
//
//         table.createTable();
//         table.updateTable();
//     });
// });


// // ********************** HACKER VERSION ***************************
/**
 * Loads in fifa-matches.csv file, aggregates the data into the correct format,
 * then calls the appropriate functions to create and populate the table.
 *
 */
d3.csv("data/fifa-matches.csv", function (error, matchesCSV) {

    // Group    -> 1/8 -> QuoterFinal -> SemiFinal -> Forth Place -> 3rd Place -> RunnerUp -> Winner
    // 0        ->  1  ->        2    ->    3      ->       4     ->    5      ->     6    ->  7
    let rating = {
        'Winner': 7,
        'Runner-Up': 6,
        'Third Place': 5,
        'Fourth Place': 4,
        'Semi Finals': 3,
        'Quarter Finals': 2,
        'Round of Sixteen': 1,
        'Group': 0
    };
    function getGames(data) {
        let result = [];
        for (let it in data) {
            result.push({
                'key': data[it]['Opponent'],
                'value': {
                    'Goals Made': data[it]['Goals Made'],
                    'Goals Conceded': data[it]['Goals Conceded'],
                    'Delta Goals': data[it]['Delta Goals'],
                    'Wins': data[it]['Wins'],
                    'Losses': data[it]['Losses'],
                    'Result': {
                        'label': data[it]['Result'],
                        'ranking': rating[data[it]['Result']]
                    },
                    'type': 'game',
                    'opponent': data[it]['Team']
                }
            })
        }
        return result.sort((a,b) => (a.value.Result.ranking> b.value.Result.ranking ? -1 : 1))
    }

    let teamData = d3.nest().key(d => d.Team)
        .rollup(function (country) {
            return {
                'Goals Made': d3.sum(country, d => d['Goals Made']),
                'Goals Conceded': d3.sum(country, d => d['Goals Conceded']),
                'Delta Goals': d3.sum(country, d => d['Delta Goals']),
                'Wins': d3.sum(country, d => d['Wins']),
                'Losses': d3.sum(country, d => d['Losses']),
                'Result': {
                    'label': Object.keys(rating).find(key => rating[key] === d3.max(country, d => rating[d['Result']])),
                    'ranking': d3.max(country, d => rating[d['Result']])
                },
                'TotalGames': country.length,
                'games': getGames(country),
                'type': 'aggregate'
            }
        })
        .entries(matchesCSV);


    d3.csv("data/fifa-tree.csv", function (error, treeCSV) {
        // Create a unique "id" field for each game
        treeCSV.forEach(function (d, i) {
            d.id = d.Team + d.Opponent + i;
        });

        //Create Tree Object
        let tree = new Tree();
        // tree.createTree(treeCSV);

        //Create Table Object and pass in reference to tree object (for hover linking)
        let table = new Table(teamData,tree);

        table.createTable();
        table.updateTable();

    });

});
// ********************** END HACKER VERSION ***************************
