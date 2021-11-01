import get from 'lodash/get';
import create from 'lodash/create';

export default class Context<T> {
  public context: Partial<T>;

  constructor(public parent?: Context<T>) {
    this.context = create(
      get(parent, 'context') || {},
    );
  }

  getChild() {
    return new Context<T>(this);
  }
}
