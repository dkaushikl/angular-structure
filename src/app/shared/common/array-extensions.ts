interface Array<T> {
  sum(key: string): number;
  findWithId(id: number): T;
  count(): number;
  last(): T;
  first(): T;
}

Array.prototype.sum = function(key: string) {
  if (this.count() <= 0) {
    return 0;
  }
  let total = 0;
  for (let i = 0, _len = this.length; i < _len; i++) {
    total += this[i][key];
  }
  return total;
};

Array.prototype.findWithId = function(id: number) {
  for (let i = 0, len = this.length; i < len; i++) {
    const item = this[i];
    if ((<any>item).id === id) {
      return item;
    }
    return null;
  }
};

Array.prototype.first = function() {
  return this.count() > 0 ? this[0] : null;
};

Array.prototype.last = function() {
  return this.count() > 0 ? this[this.length - 1] : null;
};

Array.prototype.count = function() {
  return this.length;
};
