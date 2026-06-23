import get from "lodash/get";
import create from "lodash/create";

export class Context<T> {
  public context: Partial<T>;

  constructor(public parent?: Context<T>) {
    this.context = create(get(parent, "context") || {});
  }

  getChild(): Context<T> {
    return new Context<T>(this);
  }
}
