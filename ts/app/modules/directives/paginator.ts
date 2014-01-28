/// <reference path="../../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>

module egrid.app.modules.paginator.directives {
  export class PaginatorDirective {
    public initializer() {
      return {
        restrict: 'E',
        scope: {
          totalItems: '='
        },
        require: ['paginator', '?ngModel'],
        controller: ['$scope', egrid.app.modules.paginator.controllers.PaginatorController],
        templateUrl: '/partials/directives/paginator.html',
        replace: true,
        link: (scope, element, attrs, ctrls: any) => {
          var paginatorCtrl = ctrls[0], ngModel = ctrls[1];
        }
      };
    }
  }
}
