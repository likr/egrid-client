/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="interfaces/ientity.ts"/>
/// <reference path="value-object.ts"/>

module egrid.model {
  /**
  * @abstract Entity
  */
  export class Entity implements interfaces.IEntity {
    private key_: ValueObject<string>;

    public static type: string;

    public set key(key: string) {
      if (!this.key_)
        this.key_ = new ValueObject<string>(key);
    }

    public get key(): string {
      return (this.key_)
        ? this.key_.value
        : '';
    }

    /**
     * @abstract
     * @param   object
     */
    public load(o: any): Entity {
      throw new Error('NotImplementedException');
    }

    /**
     * @abstract
     * @param key string プライマリ キー
     */
    public get(key: string): JQueryPromise<Entity> {
      throw new Error('NotImplementedException');
    }

    /**
     * そのうち誰かが分離してくれる
     *
     * @abstract
     */
    public save(): JQueryPromise<Entity> {
      throw new Error('NotImplementedException');
    }

    /**
     * 一覧用
     *
     * @abstract
     */
    public static listUrl(key?: string): string {
      throw new Error('NotImplementedException');
    }

    /**
     * 個別
     *
     * @abstract
     */
    public url(key? : string) : string {
      throw new Error('NotImplementedException');
    }

    // ValueObject を変換するだけ
    public toJSON(t): any {
      var replacement = {};

      for (var k in this) {
        if (!(this[k] instanceof ValueObject)) {
          replacement[k] = this[k];
        }
      }

      return replacement;
    }
  }
}
