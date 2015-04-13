/// <reference path="../typings/jquery/jquery.d.ts"/>
/// <reference path="participant-grid-node.ts"/>
/// <reference path="participant-grid-link.ts"/>
/// <reference path="storage/storage.ts"/>

module egrid.model {
  export interface ParticipantGridData {
    projectKey : string;
    participantKey : string;
    nodes : ParticipantGridNodeData[];
    links : ParticipantGridLinkData[];
  }


  export class ParticipantGrid extends Entity implements ParticipantGridData {
    participantKey : string;
    projectKey : string;
    nodes : ParticipantGridNodeData[];
    links : ParticipantGridLinkData[];
    static type : string = 'ParticipantGrid';

    constructor(obj : ParticipantGridData) {
      super();
      this.projectKey = obj.projectKey;
      this.participantKey = (<any>this).key_ = obj.participantKey;
      this.nodes = obj.nodes;
      this.links = obj.links;
    }

    update() : JQueryPromise<void> {
      return storage.add<ParticipantGrid>(this, ParticipantGrid.type, this.projectKey, this.participantKey);
    }

    static get(projectKey : string, participantKey : string) : JQueryPromise<ParticipantGrid> {
      return storage.get<ParticipantGrid>(ParticipantGrid.type, projectKey, participantKey)
        .then((pg: ParticipantGrid) => {
            return new ParticipantGrid(pg);
          });
    }
  }
}
