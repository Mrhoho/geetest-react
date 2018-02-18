/* eslint-disable no-param-reassign */

import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import isNumber from 'lodash/isNumber';
import shallowEqualObjects from 'shallow-equal/objects';

import initGeetest from './gt';

function isValidName(name) {
  return isString(name) && name.length !== 0;
}

function buildInsEventFunc(ins) {
  if (ins.hasBuildEventFunc) return;
  // ins.onReady 等方法防止多次绑定 offline模式貌似没有一些方法判断一下
  if (isFunction(ins.onReady))
    ins.onReady(() => {
      if (isFunction(ins.readyFunc)) ins.readyFunc();
    });
  if (isFunction(ins.onSuccess))
    ins.onSuccess(() => {
      if (isFunction(ins.successFunc)) ins.successFunc();
    });
  if (isFunction(ins.onClose))
    ins.onClose(() => {
      if (isFunction(ins.closeFunc)) ins.closeFunc();
    });
  if (isFunction(ins.onError))
    ins.onError(() => {
      if (isFunction(ins.errorFunc)) ins.errorFunc();
    });

  ins.handleReady = func => {
    ins.readyFunc = func;
  };
  ins.handleSuccess = func => {
    ins.successFunc = func;
  };
  ins.handleClose = func => {
    ins.closeFunc = func;
  };
  ins.handleError = func => {
    ins.errorFunc = func;
  };

  ins.hasBuildEventFunc = true;
}

function init(config, data) {
  const newConfig = {
    gt: data.gt,
    challenge: data.challenge,
    offline: !data.success,
    new_captcha: !!data.new_captcha,
    width: isNumber(config.width) ? `${config.width}px` : config.width,
    product: config.product,
    lang: config.lang,
    protocol: config.protocol,
    area: config.area,
    next_width: config.nextWidth,
    bg_color: config.bgColor,
    timeout: config.timeout,
  };

  return new Promise((resolve, reject) => {
    try {
      initGeetest(newConfig, newIns => {
        resolve(newIns);
      });
    } catch (e) {
      reject(e);
    }
  });
}

class Storage {
  constructor() {
    this.instances = {};
  }

  async create(name, newConfig, newData, useCache, ignoreData) {
    if (this.exist(name) && useCache) {
      const { ins, data, config } = this.get(name);
      if (
        (ignoreData && shallowEqualObjects(config, newConfig)) ||
        (!ignoreData &&
          shallowEqualObjects(config, newConfig) &&
          shallowEqualObjects(data, newData))
      )
        return ins;
    }

    const newIns = await init(newConfig, newData);
    buildInsEventFunc(newIns);
    this.instances[name] = {
      ins: newIns,
      data: newData,
      config: newConfig,
    };

    return newIns;
  }

  get(name) {
    if (this.exist(name)) {
      return this.instances[name];
    }
    return {};
  }

  remove(name) {
    if (this.exist(name)) {
      const { ins } = this.get(name);
      if (ins && isFunction(ins.destroy)) ins.destroy();
      delete this.instances[name];
    }
  }

  exist(name) {
    return (
      isValidName(name) &&
      Object.prototype.hasOwnProperty.call(this.instances, name)
    );
  }
}

export default new Storage();
