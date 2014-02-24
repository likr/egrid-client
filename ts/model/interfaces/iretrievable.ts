/// <reference path="../../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
//
module egrid.model {
  export interface IRetrievable {
    retrieve<T>(): JQueryPromise<T[]>;
  }
}
