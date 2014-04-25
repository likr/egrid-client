/// <reference path="typings/jquery/jquery.d.ts"/>
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
     * @param key string プライマリ キー
     */
    public get(key: string): JQueryPromise<Entity> {
      throw new Error('NotImplementedException');
    }
  }
}
