var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint-disable no-param-reassign */
/* eslint-disable react/no-unused-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import isFunction from 'lodash/isFunction';
import storage from './storage';
import initGeetest from './gt';

// SPA 切换路由多次初始化导致head标签里脚本与样式越来越多
function cleanUpScript() {
  var matches = document.querySelectorAll('head script, head link');

  if (matches && matches.length) {
    for (var i = 0; i < matches.length; i += 1) {
      var node = matches[i];
      if (/geetest\.com/i.test(node.nodeName.toLowerCase() === 'link' ? node.href : node.src)) {
        node.parentNode.removeChild(node);
      }
    }
  }
}

var _ref = _jsx('span', {}, void 0, ' loading... ');

var RGCaptcha = function (_React$Component) {
  _inherits(RGCaptcha, _React$Component);

  function RGCaptcha(props) {
    _classCallCheck(this, RGCaptcha);

    var _this = _possibleConstructorReturn(this, (RGCaptcha.__proto__ || Object.getPrototypeOf(RGCaptcha)).call(this, props));

    _this.ins = null;
    _this.state = {
      loading: false
    };
    return _this;
  }

  _createClass(RGCaptcha, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.load();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _props = this.props,
          name = _props.name,
          width = _props.width,
          product = _props.product,
          lang = _props.lang,
          protocol = _props.protocol,
          area = _props.area,
          nextWidth = _props.nextWidth,
          bgColor = _props.bgColor,
          timeout = _props.timeout;

      if (name !== nextProps.name || width !== nextProps.width || product !== nextProps.product || lang !== nextProps.lang || protocol !== nextProps.protocol || area !== nextProps.area || nextWidth !== nextProps.nextWidth || bgColor !== nextProps.bgColor || timeout !== nextProps.timeout) {
        storage.remove(name);
        this.load();
      } else {
        this.bindEventFunc(nextProps);
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return this.state.loading !== nextState.loading;
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      cleanUpScript();
    }
  }, {
    key: 'load',
    value: function load() {
      var _this2 = this;

      if (!(window && window.document)) return;

      var data = this.props.data;


      this.setState({
        loading: true
      });

      if (isFunction(data)) {
        data().then(function (d) {
          _this2.tryInit(d);
        });
      } else {
        this.tryInit(data);
      }
    }
  }, {
    key: 'tryInit',
    value: function tryInit(data) {
      var _this3 = this;

      var _props2 = this.props,
          name = _props2.name,
          width = _props2.width,
          product = _props2.product,
          lang = _props2.lang,
          protocol = _props2.protocol,
          area = _props2.area,
          nextWidth = _props2.nextWidth,
          bgColor = _props2.bgColor,
          timeout = _props2.timeout;


      try {
        // http://docs.geetest.com/install/client/web-front/
        initGeetest({
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: !!data.new_captcha,
          width: width,
          product: product,
          lang: lang,
          protocol: protocol,
          area: area,
          next_width: nextWidth,
          bg_color: bgColor,
          timeout: timeout
        }, function (ins) {
          // 1.防止重复调用 2.offline 模式没有这些方法所以判断一下
          if (isFunction(ins.onReady)) ins.onReady(function () {
            if (typeof ins.readyFunc === 'function') ins.readyFunc();
          });
          if (isFunction(ins.onSuccess)) ins.onSuccess(function () {
            if (typeof ins.successFunc === 'function') ins.successFunc();
          });
          if (isFunction(ins.onClose)) ins.onClose(function () {
            if (typeof ins.closeFunc === 'function') ins.closeFunc();
          });
          if (isFunction(ins.onError)) ins.onError(function () {
            if (typeof ins.errorFunc === 'function') ins.errorFunc();
          });

          ins.handleReady = function (func) {
            ins.readyFunc = func;
          };
          ins.handleSuccess = function (func) {
            ins.successFunc = func;
          };
          ins.handleClose = function (func) {
            ins.closeFunc = func;
          };
          ins.handleError = function (func) {
            ins.errorFunc = func;
          };

          storage.add(name, ins);
          _this3.ins = ins;

          _this3.bindEventFunc(_this3.props);
          _this3.setState({
            loading: false
          });

          _this3.show();
        });
      } catch (e) {
        console.error(e); // eslint-disable-line
      }
    }
  }, {
    key: 'bindEventFunc',
    value: function bindEventFunc(props) {
      var ins = this.ins;
      var onReady = props.onReady,
          onSuccess = props.onSuccess,
          onClose = props.onClose,
          onError = props.onError;

      if (ins) {
        ins.handleReady(onReady);
        ins.handleSuccess(onSuccess);
        ins.handleClose(onClose);
        ins.handleError(onError);
      }
    }
  }, {
    key: 'show',
    value: function show() {
      var product = this.props.product;
      var ins = this.ins,
          box = this.box;

      if (ins && product !== 'bind') ins.appendTo(box);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var product = this.props.product;
      var loading = this.state.loading;


      var loadingTip = loading ? _ref : null;
      return _jsx('div', {
        style: { display: product === 'bind' ? 'none' : 'block' }
      }, void 0, _jsx('div', {
        style: { display: loading ? 'block' : 'none' }
      }, void 0, loadingTip), React.createElement('div', {
        style: { display: loading ? 'none' : 'block' },
        ref: function ref(box) {
          _this4.box = box;
        }
      }));
    }
  }]);

  return RGCaptcha;
}(React.Component);

RGCaptcha.defaultProps = {
  width: '300px',
  product: 'popup',
  lang: 'zh-cn',
  protocol: null,
  area: null,
  nextWidth: null,
  bgColor: null,
  timeout: null,
  onReady: null,
  onSuccess: null,
  onClose: null,
  onError: null
};

export default RGCaptcha;