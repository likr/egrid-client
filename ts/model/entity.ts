/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="interfaces/iserializable.ts"/>
/// <reference path="value-object.ts"/>

module egrid.model {
  /**
  * @abstract Entity
  */
  export class Entity implements ISerializable<Entity> {
    private key_: ValueObject<string>;

    public getKey(): string {
      if (this.key_)
        return this.key_.vomit();
      else
        throw new Error('UnsupportedException');
    }

    public setKey(key: string): void {
      // instanceof Entity とかしたほうがいいかも
      if (!this.key_)
        this.key_ = new ValueObject<string>(key);
    }

    public static getUri(): string {
      throw new Error('NotImplementedException');
    }

    /**
     * @abstract
     * @param   object
     */
    public deserialize(o: any): Entity {
      throw new Error('NotImplementedException');
    }

    /**
     * @abstract
     * @param   object
     */
    public serialize(): any {
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
     * 面倒だからここ
     * そのうちちゃんと実装してくれるはず
     * http://msdn.microsoft.com/ja-jp/library/system.object.gettype.aspx
     *
     * @abstract
     */
    public getType(): string {
      throw new Error('NotImplementedException');
    }

    /**
     * 分離したい
     *
     * @abstract
     */
    public getUri(): string {
      throw new Error('NotImplementedException');
    }
  }
}
