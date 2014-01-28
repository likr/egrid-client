/// <reference path="../../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../../model/project.ts"/>

module egrid.app.modules.paginator.controllers {
  export class PaginatorController {
    private processedItems: Object[] = [];
    private items: Object[] = [];

    constructor($q, $scope, $filter: ng.IFilterService) {
      $scope.currentPage = 1;
      $scope.reverse = true;
      $scope.predicate = 'created_at';
      $scope.size = 0;
      $scope.itemsPerPage = 2;

      $scope.$watchCollection(() => { // 検索してるとき
        return this.processedItems;
      }, () => {
        $scope.render();
      });
      $scope.$watch('currentPage', () => { // ページが変わるとき
        $scope.render();
      });

      $q
        .when(model.Project.query())
        .then((items : Object[]) => {
          this.processedItems = this.items = items;
        });

      $scope.render = () => {
        this.processedItems = $filter('orderBy')(this.processedItems, $scope.predicate, $scope.reverse);

        $scope.paginatedItems = [];
        $scope.size = this.processedItems.length;

        for (var i = 0, l = this.processedItems.length; i < l; i++) {
          if ((i % $scope.itemsPerPage) === 0) {
            $scope.paginatedItems[Math.floor(i / $scope.itemsPerPage) + 1] = [ this.processedItems[i] ];
          } else {
            $scope.paginatedItems[Math.floor(i / $scope.itemsPerPage) + 1].push(this.processedItems[i]);
          }
        }
      };

      $scope.search = () => {
        this.processedItems = $filter('filter')(this.items, (item: any) => {
          if (!$scope.query) return true;

          return item.name.toLowerCase().indexOf($scope.query.toLowerCase()) !== -1;
        });
      };

      $scope.setPage = (page: number) => {
        $scope.currentPage = page;
      };
    }
  }
}
