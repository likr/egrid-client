/// <reference path="../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="controllers/paginator.ts"/>
/// <reference path="directives/paginator.ts"/>

module egrid.app.modules {
  angular.module('paginator.controllers', [])
    .controller('PaginatorController', egrid.app.modules.paginator.controllers.PaginatorController);
  angular.module('paginator.directives', [])
    .directive('paginator', () => new egrid.app.modules.paginator.directives.PaginatorDirective());
  angular.module('paginator', ['paginator.controllers', 'paginator.directives']);
}
