import { proxy, useSnapshot } from 'valtio';

export abstract class ViewModelBase<T extends Record<string, any>> {
  protected abstract $data(): T;

  private whiteList = ['constructor', '$data'];

  protected data: T;

  constructor() {
    this.data = proxy(this.$data());
    this.$init();
  }

  private $init() {
    const protoFunList = Object.getOwnPropertyNames(
      Object.getPrototypeOf(this)
    );
    protoFunList
      .filter((key) => !this.whiteList.includes(key))
      .forEach((key) => {
        const val = (this as any)[key];

        if (typeof val === 'function') {
          const fn = val.bind(this);
          (this as any)[key] = fn;
        }
      });
  }

  $useSnapshot() {
    return useSnapshot(this.data);
  }
}
