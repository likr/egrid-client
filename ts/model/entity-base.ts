/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="ideserializable.ts"/>

module egrid.model {
  /**
  * @abstract EntityBase
  */
  export class EntityBase implements IDeserializable {
    private key_: string;

    protected url(): string {
      throw new Error('Unimplemented');
    }

    /**
     * @param   object
     * @param   Function  callback
     */
    public deserialize<T>(o: any, c: Function): T {
    }
  }
}
