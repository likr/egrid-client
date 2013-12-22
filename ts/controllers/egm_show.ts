/// <reference path="../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="../egm.ts"/>

module Controllers {
  interface Data {
    nodes : Egm.Node[];
    links : Egm.Link[];
  }


  export function EgmShowController($scope, $routeParams, $http, $location) {
    var projectId = $scope.projectId = $routeParams.projectId;
    var participantId = $scope.participantId = $routeParams.participantId;
    var jsonUrl = "/api/participants/" + projectId + "/" + participantId + "/grid";

    var egm = new Egm.EgmUi;
    d3.select("#display")
      .call(egm.display())
      ;

    $http.get(jsonUrl).success(data => {
      var nodes = data.nodes.map(d => new Egm.Node(d.text, d.weight, d.original));
      var links = data.links.map(d => new Egm.Link(nodes[d.source], nodes[d.target], d.weight));
      egm
        .nodes(nodes)
        .links(links)
        .draw()
        .focusCenter()
        ;
    });
  }
}
