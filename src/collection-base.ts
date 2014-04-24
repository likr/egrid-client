/// <reference path="typings/jquery/jquery.d.ts"/>
/// <reference path="entity.ts"/>

module egrid.model {
  export class Dictionary<TValue> {
    private pairs = {};

    public getItem(k: string): TValue {
      return this.pairs[k];
    }

    public removeItem(k: string) {
      delete this.pairs[k];
    }

    public setItem(k: string, v: TValue) {
      this.pairs[k] = v;
    }

    public toArray(): TValue[] {
      return Object.keys(this.pairs).map((v: string, i: number, ar: string[]) => {
        return this.pairs[v];
      });
    }

    public toJSON(): any {
      var replacement = {};

      Object.keys(this.pairs).forEach((k) => {
        replacement[k] = this.pairs[k];
      });

      return replacement;
    }
  }

  export class NotationDeserializer {
    public static load(o: any): any[] {
      var b = JSON.parse(o);

      return b
        ? Object.keys(b)
            .map((v, i, ar) => {
                return b[v];
              })
        : [];
    }
  }

  /**
  * @class Collection
  */
  export class CollectionBase<T extends Entity> {
    private pairs_;

    constructor(pairs : Dictionary<T>) {
      this.pairs_ = new ValueObject<Dictionary<T>>(pairs);
    }

    public get pairs(): ValueObject<Dictionary<T>> {
      return this.pairs_;
    }

    public addItem(item: T): void {
      this.pairs.value.setItem(item.key, item);
    }

    public getItem(k: string): T {
      return this.pairs.value.getItem(k);
    }

    public removeItem(k: string) {
      return this.pairs.value.removeItem(k);
    }

    /**
     * GET メソッドを発行し this.collection を満たします。
     *
     * @abstract
     * @param   type  new() => T  モデルのコンストラクタ (TypeScript の制限より)
     */
    public query(key?: string): JQueryPromise<T[]> {
      throw new Error('NotImplementedException');
    }

    public toArray(): T[] {
      return this.pairs.value.toArray();
    }

    public static pluralize(word: string): string {
      return word + 's';
    }
  }
}
