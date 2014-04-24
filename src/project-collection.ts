/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="entity.ts"/>

module egrid.model {
  export class ProjectCollection extends CollectionBase<Project> {
    constructor() {
      super(new Dictionary<Project>());
    }

    /**
     * GET メソッドを発行し this.collection を満たします。
     *
     * @param   type  new() => T  モデルのコンストラクタ (TypeScript の制限より)
     */
    public query(key?: string): JQueryPromise<Project[]> {
      return egrid.storage.retrieve<Project>(Project.type);
    }
  }
}
