import get from 'lodash/get';
import Context from './Context';

export default class ContextProvider<T> {
  public activeContext?: Context<T>;

  get context() {
    return this.activeContext?.context;
  }

  createContext = () => {
    if (!this.activeContext) {
      this.activeContext = new Context<T>();
    } else {
      this.activeContext = this.activeContext.getChild();
    }
  };

  releaseContext = () => {
    this.activeContext = get(this.activeContext, 'parent');
  };
}
