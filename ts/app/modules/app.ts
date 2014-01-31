/// <reference path="../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>

module egrid.app.modules {
  angular.module('paginator.filters', [])
    .filter('pager', () => { return (input: any[], currentPage: number, itemsPerPage: number) => {
      var begin = (currentPage - 1) * itemsPerPage;

      return input.slice(begin, begin + itemsPerPage);
    } });
  angular.module('paginator', ['paginator.filters']);
}
