/// <reference path="participant-grid-node.ts"/>

module egrid.model {
  export interface ProjectGridNodeData extends ParticipantGridNodeData {
    participants : string[];
  }
}
