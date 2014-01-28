/// <reference path="../../../ts-definitions/DefinitelyTyped/angularjs/angular.d.ts"/>

module egrid.app.modules.paginator.directives {
  export class PaginatorDirective implements ng.IDirective {
    restrict: string = 'E';
    templateUrl: string = '/partials/directives/paginator.html';
    transclude: any = false;
    replace: boolean = true;
    scope: boolean = true;
  }
}
