import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';

function isValidName(name) {
  return isString(name) && name.length !== 0;
}

class Storage {
  constructor() {
    this.instances = {};
  }

  add(name, instance) {
    if (this.get(name)) {
      this.remove(name);
    }
    this.instances[name] = instance;
  }

  get(name) {
    if (this.exist(name)) {
      return this.instances[name];
    }
    return null;
  }

  remove(name) {
    const ins = this.get(name);
    if (ins && isFunction(ins.destroy)) ins.destroy();
    delete this.instances[name];
  }

  exist(name) {
    return (
      isValidName(name) &&
      Object.prototype.hasOwnProperty.call(this.instances, name)
    );
  }
}

export default new Storage();
