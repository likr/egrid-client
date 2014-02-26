module egrid.model {
  /**
  * @abstract ValueObject
  */
  export class ValueObject<T> {
    private value: T;

    constructor(v: T) {
      this.value = v;
    }

    public vomit(): T {
      return this.value;
    }

    public toString(): string {
      return this.value.toString();
    }
  }
}
