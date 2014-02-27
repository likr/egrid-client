module egrid.model {
  /**
   * 変更できない値を表現します。
   *
   * @class  ValueObject
   * @param  T   保持する値のデータ型
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
