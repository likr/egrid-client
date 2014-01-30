/// <reference path="../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../../model/project.ts"/>

module egrid.app.modules {
  angular.module('paginator.filters', [])
    .filter('pager', () => { return (input: model.Project[], currentPage: number, itemsPerPage: number) => {
      var begin = (currentPage - 1) * itemsPerPage;

      return input.slice(begin, begin + itemsPerPage);
    } });
  angular.module('paginator', ['paginator.filters']);
}
