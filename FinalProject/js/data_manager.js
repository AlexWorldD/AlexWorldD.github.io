const GroupNames = ['Space_Live',
    'O_Cosmose',
    'Ros_Cosmos',
    'V_Cosmose'];
unpack_data();
get_encodes();

class data_manager {
    constructor(data, map_data) {
        this.Data = data;
        this.Map = map_data;
        this.modify_data();
        // this.lines = this.getLines();
    }

    modify_data() {
        let parseDate = d3.timeParse("%Y-%m-%d");
        this.Data.forEach(d => d['stat'].forEach(t => (t['str_date']=t['date'], t['date'] = parseDate(t['date']))));
    }

    find_max() {
        get_encodes();
        return Math.max.apply(Math, this.Data.filter(t => window.groups.includes(t['GroupName'])).map(g => Math.max.apply(Math, g['stat'].map(d => unpack_data(d)))));
    }

    get_lines() {
        get_encodes();
        return this.Data.filter(t => window.groups.includes(t['GroupName']));
    }

    get_values(date) {
        return this.Data.filter(t => window.groups.includes(t['GroupName'])).map(t=>t['stat'].filter(d => d['str_date'] === date)).reduce((a,b)=>a.concat(b));
    }

}

function unpack_data(data, item = window.encoding) {
    switch (item) {
        case 'views':
            if (window.gender==='none') {
                return data['value'][item];
            }
            else {
                return data['value']['gender'][window.gender];
            }
        case 'visitors':
            return data['value'][item];
        case 'likes':
            return data['value']['feedback']['Мне нравится'];
    }
}
function get_color4map(region) {
    let res = window.AllData.Map.total.filter(t => window.groups.includes(t['GroupName'])).map(t=> t['stat'].hasOwnProperty(region) ? t['stat'][region] : 0);
    let max, idx;
    if (Math.max.apply(Math,res)>0) {
        max = Math.max.apply(Math,res);
        idx = res.indexOf(max);
        return [window.groups[idx], max];
    }
    else {
        return ['Def', 5];
    }
}
function update_color4map(region, date) {
    let res = window.AllData.Map.daily[date].filter(t => window.groups.includes(t['GroupName'])).map(t=> t['Cities'].hasOwnProperty(region) ? t['Cities'][region] : 0);
    let max, idx;
    if (Math.max.apply(Math,res)>0) {
        // ATTENTION: based on the total views approach
        let t = window.AllData.Map.daily[date].filter(t => window.groups.includes(t['GroupName'])).map(t=>Object.values(t.Cities).reduce((a, b) => a + b));
        let _r = [];
        for (let i=0; i<window.groups.length;i++) {
            _r[i] = res[i]/t[i]
        }
        max = Math.max.apply(Math,_r);
        idx = _r.indexOf(max);
        return [window.groups[idx], max];
    }
    else {
        return ['Def', 5];
    }
}

function get_encodes() {
    // Getting encode parameters from imput form
    let _new_gr = [];
    d3.selectAll('input[type=checkbox]:checked')._groups[0].forEach(it => _new_gr.push(it.value));
    window.groups = _new_gr;
    window.encoding = d3.select('#Encoding').node().value;
    window.gender = d3.select('#gender').node().value;
    if (window.encoding==='views') {
        d3.select('#gender_select')
            .transition()
            .duration(400)
            .attr('hidden', null)
            .style('opacity', 1);
    }
    else {
        d3.select('#gender_select')
            .transition()
            .duration(400)
            .style('opacity', 0)
            .transition()
            .duration(100)
            .attr('hidden', true);
    }
    // encoding = d3.select('#Encoding').node().value;
    // coordinates = d3.select('input[name="coordinates"]:checked').node().value;
    // global_l = d3.selectAll('input[name="global_l"]:checked').node().value;
    // local_l = d3.selectAll('input[name="group_l"]:checked').node().value;
}