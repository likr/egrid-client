/// <reference path="../model/project.ts"/>

module egrid.app {
  export class ProjectListController {
    list : model.Project[] = [];

    constructor($q, $scope, $filter: ng.IFilterService) {
      $scope.itemsPerPage = 2;
      $scope.reverse = true;
      $scope.predicate = 'created_at';
      $scope.size = 0;
      $scope.processedProjects = [];
      $scope.currentPage = 1;

      $scope.$watchCollection('processedProjects', () => {
        $scope.render();
      });
      $scope.$watch('currentPage', () => {
        $scope.render();
      });

      $q
        .when(model.Project.query())
        .then((projects : model.Project[]) => {
          $scope.processedProjects = this.list = projects;
        });

      $scope.render = () => {
        $scope.processedProjects = $filter('orderBy')($scope.processedProjects, $scope.predicate, $scope.reverse);
        $scope.paginatedProjects = [];
        $scope.size = $scope.processedProjects.length;

        for (var i = 0, l = $scope.processedProjects.length; i < l; i++) {
          if ((i % $scope.itemsPerPage) === 0) {
            $scope.paginatedProjects[Math.floor(i / $scope.itemsPerPage) + 1] = [ $scope.processedProjects[i] ];
          } else {
            $scope.paginatedProjects[Math.floor(i / $scope.itemsPerPage) + 1].push($scope.processedProjects[i]);
          }
        }
      };

      $scope.search = () => {
        $scope.processedProjects = $filter('filter')(this.list, (project: model.Project) => {
          if (!$scope.query) return true;

          return project.name.toLowerCase().indexOf($scope.query.toLowerCase()) !== -1;
        });
      };

      $scope.setPage = (page: number) => {
        $scope.currentPage = page;
      };
    }

    private search(haystack: string, needle: string): boolean {
      if (!needle) return true;

      return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
    }

    /**
     * @copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
     * @license   MIT License
     */
    private range(start: number, stop?: number, step?: number): number[] {
      if (arguments.length <= 1) {
        stop = start || 0;
        start = 0;
      }

      step = arguments[2] || 1;

      var length: number = Math.max(Math.ceil((stop - start) / step), 0);
      var idx: number = 0;
      var range: number[] = new Array(length);

      while(idx < length) {
        range[idx++] = start;
        start += step;
      }

      return range;
    }
  }
}
