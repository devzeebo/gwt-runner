import get from 'lodash/get';
import Context from './Context';

export default class ContextProvider {
  constructor() {
    this.activeContext = null;
  }

  spawnContext = () => {
    if (!this.activeContext) {
      this.activeContext = new Context();
    } else {
      this.activeContext = this.activeContext.getChild();
    }
  }

  revertContext = () => {
    this.activeContext = get(this.activeContext, 'parent');
  }
}
