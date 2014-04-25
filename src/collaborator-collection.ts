/// <reference path="typings/jquery/jquery.d.ts"/>
/// <reference path="collaborator.ts"/>
/// <reference path="collection-base.ts"/>
/// <reference path="entity.ts"/>

module egrid.model {
  export class CollaboratorCollection extends CollectionBase<Collaborator> {
    constructor() {
      super(new Dictionary<Collaborator>());
    }

    /**
     * GET メソッドを発行し this.collection を満たします。
     *
     * @param   type  new() => T  モデルのコンストラクタ (TypeScript の制限より)
     */
    public query(projectKey?: string): JQueryPromise<Collaborator[]> {
      return egrid.storage.retrieve<Collaborator>(Collaborator.type, projectKey);
    }

    public getItem(k: string): Collaborator {
      var o = super.getItem(k);
      return new Collaborator(o).load(o);
    }
  }
}
