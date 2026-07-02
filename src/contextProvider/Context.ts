export class Context<T> {
  public context: Partial<T>;

  constructor(public parent?: Context<T>) {
    this.context = Object.create(parent?.context || {});
  }

  getChild(): Context<T> {
    return new Context<T>(this);
  }
}
