// let width = d3.select('#line_chart').node().getBoundingClientRect().width;
let width = 850;
let height = 350;
let low_line;
let line;
let duration = 1000;
let margin = {top: 10, right: 20, bottom: 20, left: 40};

function intersect(a, b) {
    return [...new Set(a)].filter(x => new Set(b).has(x));
}

class line_chart {
    constructor() {
        this.DataManager = window.AllData;
        this.Data = this.DataManager.get_lines();
        this.Lines;
        this.xScale;
        this.yScale;
        this.userActive = false;
        this.draw();
    }

    draw() {
        get_encodes();
        // Getting the MAX value for selected dim and selected groups:
        let max = this.DataManager.find_max();
        let svg = d3.select('#line_chart');
        let graph = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        // .attr('id', 'line_chart');
        this.hoverLineXOffset = margin.left + $('#line_chart').offset().left;
        this.hoverLineYOffset = margin.top + $('#line_chart').offset().top;
        // X Scale
        let xScale = d3.scaleTime().range([0, width - margin.right]);
        // Y Scale
        let yScale = d3.scaleLinear().range([height, 0]);
        // lines generator
        line = d3.line()
            .x(d => xScale(d['date']))
            .y(d => yScale(unpack_data(d)));
        low_line = d3.line()
            .x(d => xScale(d['date']))
            .y(d => yScale(0));
        // Update scales for selected data
        xScale.domain(d3.extent(this.Data[0]['stat'], d => d['date']));
        let xAxis = d3.axisBottom(xScale)
            .tickSize(6, 0)
            // .tickFormat(d3.timeFormat("%B"));
            .tickFormat(function (date) {
                if (d3.timeYear(date) < date) {
                    return d3.timeFormat('%B')(date);
                } else {
                    return d3.timeFormat('%Y')(date);
                }
            });
        yScale.domain([0, max]);
        this.xScale = xScale;
        this.yScale = yScale;
        //    Adding Axis
        graph.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(" + 0 + ',' + height + ")")
            .call(xAxis)
            .selectAll('text')
            .classed('xAxis', true);
        graph.append("g")
            .attr("class", "yAxis")
            .call(d3.axisLeft(yScale))
            .attr("transform", "translate(" + 0 + ',' + 0 + ")")
            // add current dimension for stat
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr('x', -5)
            .attr("dy", "0.71em")
            .attr("fill", "#000")
            .attr('id', 'dim')
            .text("views");

        // Drawing lines
        let g = graph.append('g')
            .classed('lines', true);

        let lines = g
            .selectAll('path')
            .data(this.DataManager.get_lines(), d => d.GroupName);
        lines
            .enter()
            .append('path')
            .attr("class", d => ("line " + d['GroupName']))
            .attr("d", d => low_line(d['stat']))
            .transition()
            .duration(duration)
            .attr("d", d => line(d['stat']));
        lines
            .exit()
            .remove();

        lines = g.selectAll('path.line');
        lines
            .on('mouseover', function (cur_line) {
                // Nodes
                lines.classed('faded', true);
                // lines
                //     .transition()
                //     .duration(300)
                //     .attr('class', d => ("line " + d['GroupName'] + ' faded'));
                // links.classed('faded', true);
                d3.select(this)
                    .classed('faded', false);
            })
            .on('mouseout', cur_line => {
                lines.classed('faded', false);
                lines.classed('focus', false);
            });
        this.g = g;
        //---------HOVERING--------
        this.hoverLine = g
            .append('line')
            .attr('x1', 10)
            .attr('x2', 10)
            .attr('y1', 0)
            .attr('y2', height)
            .classed('hover', true)
            .classed('hide', true);
        //    Current values labels
        d3.select('#line_chart')
            .on('mouseover', d => this.mouseOverGraph(event))
            .on('mouseout', d => this.mouseOutGraph(event))
            .on('mousemove', d => this.mouseOverGraph(event));

        this.labels();
        this.update_legend();

    }

    update_axis() {
        let max = this.DataManager.find_max();
        this.yScale.domain([0, max]);
        d3.select('.yAxis')
            .transition()
            .duration(1.5 * duration)
            .call(d3.axisLeft(this.yScale));
    }

    update_groups() {
        // this.update_axis();
        this.update_encoding();
        this.update_legend();
        let lines = this.g
            .selectAll('path')
            .data(this.DataManager.get_lines(), d => d.GroupName);
        lines
            .enter()
            .append('path')
            .attr("class", d => ("line " + d['GroupName']))
            .attr("d", d => low_line(d['stat']))
            .transition()
            .duration(duration)
            .attr("d", d => line(d['stat']));
        lines
            .exit()
            .transition()
            .duration(duration)
            .attr("d", d => low_line(d['stat']))
            .remove();
        lines = this.g.selectAll('path.line');
        lines
            .on('mouseover', function (cur_line) {
                // Nodes
                lines.classed('faded', true);
                // links.classed('faded', true);
                d3.select(this)
                    .classed('faded', false);
            })
            .on('mouseout', cur_line => {
                lines.classed('faded', false);
                lines.classed('focus', false);
            });


    }

    update_encoding() {
        this.update_axis();
        d3.select('#dim')
            .text(window.encoding);
        let lines = this.g
            .selectAll('path')
            .transition()
            .duration(duration)
            .attr("d", d => line(d['stat']));
    }

    labels() {
        this.currentDateLabel = d3.select('#line_chart')
            .append('text')
            .attr('x', 10)
            .attr('y', height + 45)
            .attr('id', 'xValue')
            .text('alala')
            .classed('hide', true)
    }
    update_legend() {
        d3.select('.legend')
            .remove();
        this.legendLabel = d3.select('#line_chart')
            .append('g')
            .attr('class', 'legend')
            .attr("transform", "translate(" + (width-40) + ',' + 15 + ")");
        let gr = this.legendLabel
            .selectAll('g')
            .data(window.groups)
            .enter()
            .append('g')
            .attr("transform", d=> ("translate(" + 0 + ',' + (window.groups.indexOf(d)*20) + ")"));
        gr
            .append('text')
            .attr('id', d=>d)
            .style('fill', d=>colors[d]);

    }

    mouseOverGraph() {
        this.userActive = true;
        let mouseX = event.pageX - this.hoverLineXOffset;
        let mouseY = event.pageY - this.hoverLineYOffset;
        this.currentX = mouseX;
        if (mouseX <= width - margin.right && mouseX >= 0) {
            this.hoverLine
                .classed('hide', false)
                .attr('x1', mouseX)
                .attr('x2', mouseX);
            let _date = this.getDatebyX(mouseX);
            let _d = this.DataManager.get_values(d3.timeFormat("%Y-%m-%d")(_date));
            d3.select('#xValue')
                .classed('hide', false)
                .attr('x', mouseX)
                .text(d3.timeFormat('%d %b')(_date));
            this.legendLabel
                .classed('hide', false);
            window.groups.forEach((d, i)=>this.legendLabel.select('#'+d).text(unpack_data(_d[i])));
            window.RuMap.daily_update(d3.timeFormat("%Y-%m-%d")(_date));
        }
        else {
            this.mouseOutGraph(event);
        }

    }

    mouseOutGraph() {
        this.hoverLine
            .classed('hide', true);
        this.currentDateLabel
            .classed('hide', true);
        this.legendLabel
            .classed('hide', true);
        window.RuMap.update_map();
        this.userActive = false;
    }

    getDatebyX(x) {
        return this.xScale.invert(x);
    }
}
