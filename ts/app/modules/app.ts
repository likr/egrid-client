/// <reference path="../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../model/project.ts"/>
/// <reference path="controllers/paginator.ts"/>
/// <reference path="directives/paginator.ts"/>

module egrid.app.modules {
  angular.module('paginator.filters', [])
    .filter('pager', () => { return (input: model.Project[], currentPage: number, itemsPerPage: number) => {
      var begin = (currentPage - 1) * itemsPerPage;

      return input.slice(begin, begin + itemsPerPage);
    } });
  // angular.module('paginator.controllers', [])
  //   .controller('PaginatorController', egrid.app.modules.paginator.controllers.PaginatorController);
  // angular.module('paginator.directives', [])
  //   .directive('paginator', () => new egrid.app.modules.paginator.directives.PaginatorDirective());
  angular.module('paginator', ['paginator.filters']);
}
