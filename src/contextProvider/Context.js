import get from 'lodash/get';
import create from 'lodash/create';

export default class Context {
  constructor(parent = null) {
    this.parent = parent;
    this.context = create(get(parent, 'context'));
  }

  getChild() {
    return new Context(this);
  }
}
