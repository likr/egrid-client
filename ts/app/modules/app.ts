/// <reference path="../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="controllers/paginator.ts"/>
/// <reference path="directives/paginator.ts"/>

module egrid.app.modules {
  angular.module('paginator.controllers', [])
    .controller('PaginatorController', [egrid.app.modules.paginator.controllers.PaginatorController]);
  angular.module('paginator.directives', [])
    .directive('paginator', () => {
      return {
        restrict: 'E',
        scope: true,
        controller: egrid.app.modules.paginator.controllers.PaginatorController,
        templateUrl: '/partials/directives/paginator.html',
        replace: true,
        link: (scope, element, attrs, ctrls: any) => {
          var paginatorCtrl = ctrls[0], ngModel = ctrls[1];
        }
      };
    });
  angular.module('paginator', ['paginator.controllers', 'paginator.directives']);
}
