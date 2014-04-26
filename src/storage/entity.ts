module egrid.model {
  export interface StorableData {
    key : string;
    createdAt : Date;
    updatedAt : Date;
  }


  export interface SerializedData {
    key : string;
    createdAt : string;
    updatedAt : string;
  }


  export class Entity implements StorableData {
    private key_ : string;
    private createdAt_ : Date;
    private updatedAt_ : Date;

    public get key() : string {
      return this.key_;
    }

    public get createdAt() : Date {
      return this.createdAt_;
    }

    public get updatedAt() : Date {
      return this.updatedAt_;
    }

    public persisted() : boolean {
      return !!this.key;
    }
  }
}
