/// <reference path="../jquery/jquery.d.ts" />
declare module egrid.model {
    interface StorableData {
        key: string;
        createdAt: Date;
        updatedAt: Date;
    }
    interface SerializedData {
        key: string;
        createdAt: string;
        updatedAt: string;
    }
    class Entity implements StorableData {
        private key_;
        private createdAt_;
        private updatedAt_;
        key: string;
        createdAt: Date;
        updatedAt: Date;
        persisted(): boolean;
    }
}
declare module egrid.model.storage {
    var API_URL_BASE: string;
    module Api {
        function get<T>(name: string, projectKey: string, key?: string): JQueryPromise<T>;
        function post<T>(data: T, name: string, projectKey?: string): JQueryPromise<T>;
        function put<T>(data: T, name: string, projectKey: string, key?: string): JQueryPromise<T>;
        function remove(name: string, projectKey: string, key?: string): JQueryPromise<void>;
        function retrieve<T extends StorableData>(name: string, projectKey?: string): JQueryPromise<T[]>;
    }
}
declare module egrid.model.storage {
    function add<T extends StorableData>(value: T, name: string, projectId?: string, participantId?: string): JQueryPromise<void>;
    function get<T extends StorableData>(name: string, projectId: string, participantId?: string): JQueryPromise<T>;
    function remove<T extends StorableData>(name: string, projectId: string, participantId?: string): JQueryPromise<void>;
    function retrieve<T extends StorableData>(name: string, projectId?: string): JQueryPromise<any>;
}
declare module egrid.model {
    interface ProjectData {
        name: string;
        note: string;
    }
    /**
    * @class Project
    */
    class Project extends Entity implements ProjectData {
        name: string;
        note: string;
        constructor(obj?: ProjectData);
        static get(key: string): JQueryPromise<Project>;
        static query(): JQueryPromise<Project[]>;
        /**
         * POST/PUT リクエストを発行します。
         *
         * @throws  Error
         */
        save(): JQueryPromise<void>;
        remove(): JQueryPromise<void>;
    }
}
declare module egrid.model {
    interface AnalysisData {
        name?: string;
        project?: ProjectData;
        projectKey: string;
    }
    class Analysis extends Entity implements AnalysisData {
        name: string;
        project: ProjectData;
        projectKey: string;
        constructor(obj: AnalysisData);
        static get(projectKey: string, key: string): JQueryPromise<Analysis>;
        static query(projectKey: string): JQueryPromise<Analysis[]>;
        save(): JQueryPromise<void>;
        remove(): JQueryPromise<void>;
    }
}
declare module egrid.model {
    interface UserData {
        email?: string;
        location?: string;
        nickname?: string;
    }
    class User implements UserData {
        private key_;
        email: string;
        location: string;
        nickname: string;
    }
}
declare module egrid.model {
    interface CollaboratorData {
        isManager?: boolean;
        project?: ProjectData;
        projectKey: string;
        user?: UserData;
        userEmail?: string;
    }
    class Collaborator extends Entity {
        isManager: boolean;
        project: ProjectData;
        projectKey: string;
        user: UserData;
        userEmail: string;
        static type: string;
        static url: string;
        constructor(obj?: CollaboratorData);
        /**
         * Object から Participant に変換します。
         *
         * @param   object
         */
        load(o: any): Collaborator;
        /**
         */
        get(key: string): JQueryPromise<Collaborator>;
        static query(projectKey: string): JQueryPromise<Collaborator[]>;
        /**
         * POST/PUT リクエストを発行します。
         *
         * @throws  Error
         */
        save(): JQueryPromise<void>;
        remove(): JQueryPromise<void>;
    }
}
declare module egrid.model {
    interface ParticipantData {
        name?: string;
        note?: string;
        project?: ProjectData;
        projectKey: string;
    }
    class Participant extends Entity {
        name: string;
        note: string;
        project: ProjectData;
        projectKey: string;
        constructor(obj?: ParticipantData);
        static get(projectKey: string, key: string): JQueryPromise<Participant>;
        static query(projectKey: string): JQueryPromise<Participant[]>;
        save(): JQueryPromise<void>;
        remove(): JQueryPromise<void>;
    }
}
declare module egrid.model {
    interface ParticipantGridNodeData {
        text: string;
        weight: number;
        original: boolean;
    }
}
declare module egrid.model {
    interface ParticipantGridLinkData {
        source: number;
        target: number;
        weight: number;
    }
}
declare module egrid.model {
    interface ParticipantGridData {
        projectKey: string;
        participantKey: string;
        nodes: ParticipantGridNodeData[];
        links: ParticipantGridLinkData[];
    }
    class ParticipantGrid extends Entity implements ParticipantGridData {
        participantKey: string;
        projectKey: string;
        nodes: ParticipantGridNodeData[];
        links: ParticipantGridLinkData[];
        static type: string;
        constructor(obj: ParticipantGridData);
        update(): JQueryPromise<void>;
        static get(projectKey: string, participantKey: string): JQueryPromise<ParticipantGrid>;
    }
}
declare module egrid.model {
    interface ProjectGridNodeData extends ParticipantGridNodeData {
        participants: string[];
    }
}
declare module egrid.model {
    interface ProjectGridLinkData extends ParticipantGridLinkData {
    }
}
declare module egrid.model {
    interface ProjectGridGroupData {
        children: any[];
    }
}
declare module egrid.model {
    interface ProjectGridData {
        projectKey: string;
        nodes?: ProjectGridNodeData[];
        links?: ProjectGridLinkData[];
        groups?: ProjectGridGroupData[];
        name?: string;
        note?: string;
    }
    class ProjectGrid extends Entity implements ProjectGridData {
        name: string;
        note: string;
        projectKey: string;
        nodes: ProjectGridNodeData[];
        links: ProjectGridLinkData[];
        groups: ProjectGridGroupData[];
        static type: string;
        constructor(obj: ProjectGridData);
        save(): JQueryPromise<void>;
        private load(obj);
        static get(projectKey: string, key?: string): JQueryPromise<ProjectGrid>;
        static query(projectKey: string): JQueryPromise<ProjectGrid>;
        private static load(obj);
    }
}
declare module egrid.model {
    class Questionnaire extends Entity {
        projectKey: string;
        formUrl: string;
        sheetUrl: string;
        save(): JQueryPromise<void>;
        static get(projectKey: string, key: string): JQueryPromise<Questionnaire>;
    }
}
declare module egrid.model {
    interface SemProjectData {
        name?: string;
        project?: ProjectData;
        projectKey: string;
    }
    class SemProject extends Entity {
        name: string;
        project: ProjectData;
        projectKey: string;
        static type: string;
        static url: string;
        constructor(obj?: SemProjectData);
        /**
         */
        get(key: string): JQueryPromise<SemProject>;
        static query(projectKey: string): JQueryPromise<SemProject[]>;
        save(): JQueryPromise<SemProject>;
        /**
         * @param   key   string  Project Key
         */
        static listUrl(key?: string): string;
        /**
         * @param   key   string  SemProject Key
         */
        url(key?: string): string;
    }
}
