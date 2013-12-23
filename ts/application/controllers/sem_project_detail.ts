/// <reference path="../../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="../../ts-definitions/DefinitelyTyped/d3/d3.d.ts"/>
/// <reference path="../../sem.d.ts"/>
/// <reference path="../../egrid/egm.ts"/>
/// <reference path="../../egrid/sem.ts"/>

module Controllers {
  export function SemProjectDetailController($scope, $routeParams, $http, $location) {
    $scope.projectId = $routeParams.projectId;
  }


  export function SemProjectDetailDesignController($scope, $http) {
    var projectId = $scope.$parent.projectId;
    var overallEgm = new egrid.EGM;
    var egm = new egrid.EGM;

    $scope.semProject = {
      name: '書きやすさの分析',
      project: {
        key: projectId,
        name: 'シャープペンシル',
      },
    };

    $scope.items = [];

    $scope.fullscreen = function() {
    }

    $scope.checked = function(item) {
      return item.checked;
    };

    $scope.updateGraph = function() {
      var itemDict = {};
      $scope.items.forEach(item => {
        itemDict[item.text] = item.checked;
      });
      var nodes = [];
      var links = [];
      overallEgm.nodes().forEach(node => {
        if (itemDict[node.text]) {
          var newNode = new egrid.Node(node.text);
          newNode.index = node.index;
          nodes.push(newNode);
        }
      });
      nodes.forEach(node1 => {
        nodes.forEach(node2 => {
          if (node1.index != node2.index && overallEgm.grid().hasPath(node1.index, node2.index)) {
            links.push(new egrid.Link(node1, node2));
          }
        });
      });
      egm
        .nodes(nodes)
        .links(links)
        .draw()
        .focusCenter()
        ;
    };

    $http.get("/api/projects/" + projectId + "/grid").success(data => {
      data.nodes.forEach(node => {
        $scope.items.push({
          text: node.text,
          weight: node.weight,
          checked: false,
        });
        $scope.items.sort((item1, item2) => item2.weight - item1.weight);
      });

      var width = $("#sem-questionnaire-deisgn-display").width();
      var height = $("#sem-questionnaire-deisgn-display").height();
      d3.select("#sem-questionnaire-design-display svg")
        .call(egm.display(width, height))
        ;

      var nodes = data.nodes.map(d => new egrid.Node(d.text, d.weight, d.original));
      var links = data.links.map(d => new egrid.Link(nodes[d.source], nodes[d.target], d.weight));
      overallEgm
        .nodes(nodes)
        .links(links)
        ;
    });
  }


  export function SemProjectDetailAnalysisController($scope, $http) {
    var nodes = [
      '総合評価',
      '使いたさ',
      '書きやすさ',
      '便利さ',
      '快適さ',
      '安心さ',
      '芯の太さ',
      '持ち運びやすさ',
      '持ちやすさ',
      '太さ',
      '重さ',
    ];
    var links = [
      {source: 1, target: 0},
      {source: 2, target: 0},
      {source: 3, target: 0},
      {source: 4, target: 0},
      {source: 5, target: 0},
      {source: 6, target: 2},
      {source: 8, target: 2},
      {source: 10, target: 2},
      {source: 7, target: 3},
      {source: 8, target: 3},
      {source: 8, target: 4},
      {source: 8, target: 5},
      {source: 10, target: 5},
      {source: 9, target: 7},
      {source: 10, target: 7},
      {source: 9, target: 8},
    ];
    var S = [
      [1.180487805, 0.939634146, 1.021341463, 0.646341463, 0.96402439, 0.322560976, 0.058536585, 0.117682927, 1.021341463, -0.231097561, -0.170731707],
      [0.939634146, 1.18902439, 0.915243902, 0.565243902, 0.895731707, 0.176829268, 0.106097561, 0.055487805, 0.915243902, -0.132926829, -0.02195122],
      [1.021341463, 0.915243902, 1.552439024, 0.427439024, 1.007317073, 0.018292683, 0.06097561, 0.154878049, 1.552439024, -0.179268293, -0.369512195],
      [0.646341463, 0.565243902, 0.427439024, 1.102439024, 0.482317073, -0.031707317, -0.13902439, 0.179878049, 0.427439024, -0.104268293, -0.219512195],
      [0.96402439, 0.895731707, 1.007317073, 0.482317073, 1.07195122, 0.179878049, 0.057926829, 0.114634146, 1.007317073, -0.237804878, -0.133536585],
      [0.322560976, 0.176829268, 0.018292683, -0.031707317, 0.179878049, 0.962195122, 0.157317073, -0.038414634, 0.018292683, 0.030487805, 0.128658537],
      [0.058536585, 0.106097561, 0.06097561, -0.13902439, 0.057926829, 0.157317073, 0.474390244, -0.15304878, 0.06097561, 0.093292683, -0.087804878],
      [0.117682927, 0.055487805, 0.154878049, 0.179878049, 0.114634146, -0.038414634, -0.15304878, 0.809756098, 0.154878049, -0.308536585, -0.58902439],
      [1.021341463, 0.915243902, 1.552439024, 0.427439024, 1.007317073, 0.018292683, 0.06097561, 0.154878049, 1.552439024, -0.179268293, -0.369512195],
      [-0.231097561, -0.132926829, -0.179268293, -0.104268293, -0.237804878, 0.030487805, 0.093292683, -0.308536585, -0.179268293, 1.051219512, 0.509146341],
      [-0.170731707, -0.02195122, -0.369512195, -0.219512195, -0.133536585, 0.128658537, -0.087804878, -0.58902439, -0.369512195, 0.509146341, 1.256097561],
    ];
    var SDict = {};
    nodes.forEach(node => {
      SDict[node] = {};
    });
    nodes.forEach((node1, i) => {
      nodes.forEach((node2, j) => {
        SDict[node1][node2] = S[i][j];
      });
    });

    var egmNodes = nodes.map(d => new egrid.Node(d));
    var egmLinks = links.map(d => new egrid.Link(egmNodes[d.target], egmNodes[d.source]));

    var dag = egrid
      .sem()
      .nodes(egmNodes)
      .links(egmLinks)
      .registerUiCallback(() => {
        var n = dag.nodes().length;
        var alpha = dag.links().map(link => {
          return [link.target.index, link.source.index];
        });
        var sigma = dag.nodes().map((_, i) => {
          return [i, i];
        });
        var S = dag.nodes().map(node1 => {
          return dag.nodes().map(node2 => {
            return SDict[node1.text][node2.text];
          });
        });
        sem(n, alpha, sigma, S, (result => {
          console.log(result);
          var A = dag.nodes().map(_ => {
            return dag.nodes().map(_ => 0);
          });
          result.alpha.forEach(r => {
            A[r[0]][r[1]] = r[2];
          });
          dag.links().forEach(link => {
            link.coef = A[link.target.index][link.source.index];
          });
          dag.draw();
        }));
      })
      ;

    var n = nodes.length;
    var alpha = links.map(d => [d.target, d.source]);
    var sigma = nodes.map((_, i) => [i, i]);
    sem(n, alpha, sigma, S, (result => {
      var A = dag.nodes().map(_ => {
        return dag.nodes().map(_ => 0);
      });
      result.alpha.forEach(r => {
        A[r[0]][r[1]] = r[2];
      });
      dag.links().forEach((link : any) => {
        link.coef = A[link.source.index][link.target.index];
      });
    }));

    $scope.$parent.drawSemAnalysis = function() {
      var width = $("#sem-analysis-display").width();
      var height = $("#sem-analysis-display").height();
      d3.select("#sem-analysis-display svg")
        .call(dag.display(width, height))
        ;

      dag
        .draw()
        .focusCenter();
    }
  }
}
