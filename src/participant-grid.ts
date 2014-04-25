/// <reference path="typings/jquery/jquery.d.ts"/>
/// <reference path="interfaces/ientity.ts"/>
/// <reference path="collection-base.ts"/>
/// <reference path="participant-grid-node.ts"/>
/// <reference path="participant-grid-link.ts"/>
/// <reference path="storage.ts"/>

module egrid.model {
  export interface ParticipantGridData {
    projectKey : string;
    participantKey : string;
    nodes : ParticipantGridNodeData[];
    links : ParticipantGridLinkData[];
  }


  export class ParticipantGrid implements ParticipantGridData, interfaces.IEntity {
    key : string;
    participantKey : string;
    projectKey : string;
    nodes : ParticipantGridNodeData[];
    links : ParticipantGridLinkData[];
    static type : string = 'ParticipantGrid';

    constructor(obj : ParticipantGridData) {
      this.projectKey = obj.projectKey;
      this.participantKey = this.key = obj.participantKey;
      this.nodes = obj.nodes;
      this.links = obj.links;
    }

    update() : JQueryPromise<ParticipantGrid> {
      return egrid.storage.add<ParticipantGrid>(this, ParticipantGrid.type, this.projectKey, this.key);
    }

    private url() : string {
      return ParticipantGrid.url(this.projectKey, this.key);
    }

    static get(projectKey : string, participantKey : string) : JQueryPromise<ParticipantGrid> {
      return egrid.storage.get<ParticipantGrid>(ParticipantGrid.type, projectKey, participantKey)
        .then((pg: ParticipantGrid) => {
            return new ParticipantGrid(pg);
          });
    }

    private static url(projectKey : string, participantKey : string) : string {
      return '/api/projects/' + projectKey + '/participants/' + participantKey + '/grid';
    }
  }
}
