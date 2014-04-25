/// <reference path="typings/jquery/jquery.d.ts"/>
/// <reference path="collection-base.ts"/>
/// <reference path="entity.ts"/>
/// <reference path="project.ts"/>

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
      return egrid.storage.retrieve<Project>(Project.type)
        .then(data => {
          var result = {};
          for (key in data) {
            result[key] = Project.load(data[key]);
          }
          return result;
        });
    }

    public static query() : JQueryPromise<Project[]> {
      var projects = new ProjectCollection();
      return projects.query();
    }
  }
}
