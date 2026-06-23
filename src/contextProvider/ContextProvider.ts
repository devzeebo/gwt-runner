import get from "lodash/get";
import { Context } from "./Context";

export class ContextProvider<T> {
  public activeContext?: Context<T>;

  get context(): Partial<T> | undefined {
    return this.activeContext?.context;
  }

  public createContext = (): void => {
    if (!this.activeContext) {
      this.activeContext = new Context<T>();
    } else {
      this.activeContext = this.activeContext.getChild();
    }
  };

  public releaseContext = (): void => {
    this.activeContext = get(this.activeContext, "parent");
  };
}
