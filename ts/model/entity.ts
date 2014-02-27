/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="interfaces/iserializable.ts"/>
/// <reference path="value-object.ts"/>

module egrid.model {
  /**
  * @abstract Entity
  */
  export class Entity {
    private key_: ValueObject<string>;

    public setKey(key: string): void {
      if (!this.key_)
        this.key_ = new ValueObject<string>(key);
    }

    public get key(): string {
      return (this.key_)
        ? this.key_.vomit()
        : '';
    }

    /**
     * @abstract
     * @param   object
     */
    public deserialize(o: any): Entity {
      throw new Error('NotImplementedException');
    }

    /**
     * そのうち誰かが分離してくれる
     *
     * @abstract
     */
    public publish(): JQueryPromise<Entity> {
      throw new Error('NotImplementedException');
    }

    /**
     * @abstract
     * @param key string プライマリ キー
     */
    public fetch(key: string): JQueryPromise<Entity> {
      throw new Error('NotImplementedException');
    }

    /**
     * @abstract
     */
    public url(key?: string): string {
      throw new Error('NotImplementedException');
    }

    /**
     * 面倒だからここ
     * そのうちちゃんと実装してくれるはず
     * http://msdn.microsoft.com/ja-jp/library/system.object.gettype.aspx
     *
     * @abstract
     */
    public getType(): string {
      throw new Error('NotImplementedException');
    }
  }
}
