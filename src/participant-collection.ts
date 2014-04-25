/// <reference path="typings/jquery/jquery.d.ts"/>
/// <reference path="collection-base.ts"/>
/// <reference path="participant.ts"/>
/// <reference path="storage.ts"/>

module egrid.model {
  export class ParticipantCollection extends CollectionBase<Participant> {
    constructor() {
      super(new Dictionary<Participant>());
    }

    /**
     * GET メソッドを発行し this.collection を満たします。
     *
     * @param   type  new() => T  モデルのコンストラクタ (TypeScript の制限より)
     */
    public query(projectKey?: string): JQueryPromise<Participant[]> {
      return egrid.storage.retrieve<Participant>(Participant.type, projectKey);
    }
  }
}
