module egrid.model {
  export interface IDeserializable {
    deserialize<T>(): T;
  }
}
