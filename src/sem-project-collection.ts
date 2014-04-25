/// <reference path="typings/jquery/jquery.d.ts"/>
/// <reference path="collection-base.ts"/>
/// <reference path="entity.ts"/>
/// <reference path="sem-project.ts"/>

module egrid.model {
  export class SemProjectCollection extends CollectionBase<SemProject> {
    constructor() {
      super(new Dictionary<SemProject>());
    }

    /**
     * GET メソッドを発行し this.collection を満たします。
     *
     * @param   type  new() => T  モデルのコンストラクタ (TypeScript の制限より)
     */
    public query(projectKey?: string): JQueryPromise<SemProject[]> {
      return egrid.storage.retrieve<SemProject>(SemProject.type, projectKey);
    }
  }
}
