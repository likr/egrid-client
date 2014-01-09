/// <reference path="../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="../core/egm.ts"/>
/// <reference path="../model/project-grid.ts"/>
/// <reference path="../model/sem-project.ts"/>

module egrid.app {
  export class SemProjectEditController {
    projectKey : string;
    semProjectKey : string;
    egm : EGM;
    overallEgm : EGM;
    semProject : model.SemProject;
    items;

    constructor($q, $routeParams) {
      this.projectKey = $routeParams.projectId;
      this.semProjectKey = $routeParams.semProjectId;

      this.egm = new EGM;
      this.overallEgm = new EGM;

      $q.when(model.SemProject.get(this.projectKey, this.semProjectKey))
        .then((semProject : model.SemProject) => {
          this.semProject = semProject;
        })
        ;

      $q.when(model.ProjectGrid.get(this.projectKey))
        .then((grid : model.ProjectGrid) => {
          var width = $("#sem-questionnaire-deisgn-display").width();
          var height = $("#sem-questionnaire-deisgn-display").height();
          d3.select("#sem-questionnaire-design-display svg")
            .call(this.egm.display(width, height))
            ;
          var nodes = grid.nodes.map(d => new Node(d.text, d.weight, d.original, d.participants));
          var links = grid.links.map(d => new Link(nodes[d.source], nodes[d.target], d.weight));
          this.overallEgm
            .nodes(nodes)
            .links(links)
          this.items = nodes.map(node => {
            return {
              text: node.text,
              weight: node.weight,
              checked: false,
            };
          });
          this.items.sort((item1, item2) => item2.weight - item1.weight);
        })
        ;
      
    }

    updateGraph() {
      var itemDict = {};
      this.items.forEach(item => {
        itemDict[item.text] = item.checked;
      });
      var nodes = [];
      var links = [];
      this.overallEgm.nodes().forEach(node => {
        if (itemDict[node.text]) {
          var newNode = new egrid.Node(node.text);
          newNode.index = node.index;
          nodes.push(newNode);
        }
      });
      nodes.forEach(node1 => {
        nodes.forEach(node2 => {
          if (node1.index != node2.index && this.overallEgm.grid().hasPath(node1.index, node2.index)) {
            links.push(new egrid.Link(node1, node2));
          }
        });
      });
      this.egm
        .nodes(nodes)
        .links(links)
        .draw()
        .focusCenter()
        ;
    }

    checked(item) {
      return item.checked;
    }
  }
}
