/** Class implementing the tree view. */
class Tree {
    /**
     * Creates a Tree Object
     */
    constructor() {

    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */
    createTree(treeData) {

        // ******* TODO: PART VI *******
        //Create a tree and give it a size() of 800 by 300.
        let size = [800, 400];
        let tree = d3.stratify()
            .id((d, i) => i)
            .parentId(d => d.ParentGame)(treeData)
            .each(d => (d.Name = d.data.Team, d.Winner = d.data.Wins));
        let treemap = d3.tree().size(size);
        this.nodes = treemap(d3.hierarchy(tree, d => d.children));
        let g = d3.select('#tree')
            .attr('transform', 'translate(100, 25)');
        let links = g.selectAll('.link')
            .data(this.nodes.descendants().slice(1))
            .enter()
            .append('path')
            .attr('class', 'link')
            .attr('d', d => ('M' + d.y + ',' + d.x
                + 'C' + (d.y + d.parent.y) / 2 + ',' + d.x
                + ' ' + (d.y + d.parent.y) / 2 + ',' + d.parent.x
                + ' ' + d.parent.y + ',' + d.parent.x));
        let nodes = g.selectAll('.node')
            .data(this.nodes.descendants())
            .enter()
            .append('g')
            .attr('class', d => (d.data.Winner === "1" ? 'node winner' : 'node'))
            .attr('transform', d => ('translate(' + d.y + ',' + d.x + ')'));
        nodes.append('circle')
            .attr('r', 6);
        // Align based on parents position:
        nodes.append('text')
            .attr('x', d => (d.children ? -13 : 13))
            .attr('y', d => (d.parent && d.children ? (d.data.Name === d.parent.children[0].data.Name ? -13 : 13) : 0))
            .attr('dy', '0.33em')
            .style('text-anchor', d => (d.children ? 'end' : 'start'))
            .text(d => d.data.Name);
    };

    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
    updateTree(row) {
        // ******* TODO: PART VII *******
        d3.selectAll('.link')
            .filter(d=> {
                if(row.value.type==='game') {
                    let one = row.key===d.data.Name && row.value.opponent===d.data.data.Opponent;
                    let two = row.key===d.data.data.Opponent && row.value.opponent===d.data.Name;
                    return one || two;
                }
                else {
                    return row.key===d.data.Name && row.key===d.parent.data.Name;
                }
            })
            .classed('selected', true);
        d3.selectAll('.node')
            .selectAll('text')
            .filter(d=> {
                if(row.value.type==='game') {
                    let one = row.key===d.data.Name && row.value.opponent===d.data.data.Opponent;
                    let two = row.key===d.data.data.Opponent && row.value.opponent===d.data.Name;
                    return one || two;
                }
                else {
                    return row.key===d.data.Name;
                }
            })
            .classed('selectedLabel', true);
    }

    /**
     * Removes all highlighting from the tree.
     */
    clearTree() {
        // ******* TODO: PART VII *******
        d3.selectAll('.link')
            .classed('selected', false);
        d3.selectAll('.node')
            .selectAll('text')
            .classed('selectedLabel', false);
    }
}
