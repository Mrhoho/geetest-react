var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';

function isValidName(name) {
  return isString(name) && name.length !== 0;
}

var Storage = function () {
  function Storage() {
    _classCallCheck(this, Storage);

    this.instances = {};
  }

  _createClass(Storage, [{
    key: 'add',
    value: function add(name, instance) {
      if (this.get(name)) {
        this.remove(name);
      }
      this.instances[name] = instance;
    }
  }, {
    key: 'get',
    value: function get(name) {
      if (this.exist(name)) {
        return this.instances[name];
      }
      return null;
    }
  }, {
    key: 'remove',
    value: function remove(name) {
      var ins = this.get(name);
      if (ins && isFunction(ins.destroy)) ins.destroy();
      delete this.instances[name];
    }
  }, {
    key: 'exist',
    value: function exist(name) {
      return isValidName(name) && Object.prototype.hasOwnProperty.call(this.instances, name);
    }
  }]);

  return Storage;
}();

export default new Storage();