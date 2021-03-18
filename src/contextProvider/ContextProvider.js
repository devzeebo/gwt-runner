import get from 'lodash/get';
import Context from './Context';

export default class ContextProvider {
  constructor() {
    this.activeContext = null;
  }

  get context() { return this.activeContext.context; }

  createContext = () => {
    if (!this.activeContext) {
      this.activeContext = new Context();
    } else {
      this.activeContext = this.activeContext.getChild();
    }
  }

  releaseContext = () => {
    this.activeContext = get(this.activeContext, 'parent');
  }
}
