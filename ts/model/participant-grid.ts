/// <reference path="../ts-definitions/Definitelytyped/jquery/jquery.d.ts"/>
/// <reference path="participant-grid-node.ts"/>
/// <reference path="participant-grid-link.ts"/>

module egrid.model {
  export interface ParticipantGridData {
    projectKey : string;
    participantKey : string;
    nodes : ParticipantGridNodeData[];
    links : ParticipantGridLinkData[];
  }


  export class ParticipantGrid implements ParticipantGridData {
    projectKey : string;
    participantKey : string;
    nodes : ParticipantGridNodeData[];
    links : ParticipantGridLinkData[];

    constructor(obj : ParticipantGridData) {
      this.projectKey = obj.projectKey;
      this.participantKey = obj.participantKey;
      this.nodes = obj.nodes;
      this.links = obj.links;
    }

    update() : JQueryXHR {
      return $.ajax({
        url: this.url(),
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({
          nodes: this.nodes,
          links: this.links,
        }),
        dataFilter: _ => {
          return this;
        }
      });
    }

    private url() : string {
      return ParticipantGrid.url(this.projectKey, this.participantKey);
    }

    static get(projectKey : string, participantKey : string) : JQueryXHR {
      return $.ajax({
        url: ParticipantGrid.url(projectKey, participantKey),
        type: 'GET',
        dataFilter: data => {
          var obj : ParticipantGridData = JSON.parse(data);
          return new ParticipantGrid(obj);
        },
      });
    }

    private static url(projectKey : string, participantKey : string) : string {
      return '/api/projects/' + projectKey + '/participants/' + participantKey + '/grid';
    }
  }
}
