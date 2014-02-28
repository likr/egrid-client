module egrid.model {
  /**
   * 変更できない値を表現します。
   *
   * @class  ValueObject
   * @param  T   保持する値のデータ型
   */
  export class ValueObject<T> {
    private value_: T;

    constructor(v: T) {
      this.value_ = v;
    }

    public get value(): T {
      return this.value_;
    }

    public toString(): string {
      return this.value_.toString();
    }
  }
}
