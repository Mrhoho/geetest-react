import isFunction from 'lodash/isFunction';
import storage from './storage';
import component from './component';

export { component as RGCaptcha, storage };

export function appendTo(name, position) {
  const ins = storage.get(name);
  if (ins && isFunction(ins.appendTo)) return ins.appendTo(position);
  return null;
}
export function bindForm(name, position) {
  const ins = storage.get(name);
  if (ins && isFunction(ins.bindForm)) return ins.bindForm(position);
  return null;
}
export function getValidate(name) {
  const ins = storage.get(name);
  if (ins && isFunction(ins.getValidate)) return ins.getValidate();
  return null;
}
export function reset(name) {
  const ins = storage.get(name);
  if (ins && isFunction(ins.reset)) return ins.reset();
  return null;
}
export function verify(name) {
  const ins = storage.get(name);
  if (ins && isFunction(ins.verify)) return ins.verify();
  return null;
}

export default {
  storage,
  RGCaptcha: component,
};
