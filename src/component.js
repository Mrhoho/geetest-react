/* eslint-disable no-param-reassign */
/* eslint-disable react/no-unused-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import isFunction from 'lodash/isFunction';
import storage from './storage';
import initGeetest from './gt';

// SPA 切换路由多次初始化导致head标签里脚本与样式越来越多
function cleanUpScript() {
  const matches = document.querySelectorAll('head script, head link');

  if (matches && matches.length) {
    for (let i = 0; i < matches.length; i += 1) {
      const node = matches[i];
      if (
        /geetest\.com/i.test(
          node.nodeName.toLowerCase() === 'link' ? node.href : node.src,
        )
      ) {
        node.parentNode.removeChild(node);
      }
    }
  }
}

class RGCaptcha extends React.Component {
  constructor(props) {
    super(props);
    this.ins = null;
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    this.load();
  }

  componentWillReceiveProps(nextProps) {
    const {
      name,
      width,
      product,
      lang,
      protocol,
      area,
      nextWidth,
      bgColor,
      timeout,
    } = this.props;
    if (
      name !== nextProps.name ||
      width !== nextProps.width ||
      product !== nextProps.product ||
      lang !== nextProps.lang ||
      protocol !== nextProps.protocol ||
      area !== nextProps.area ||
      nextWidth !== nextProps.nextWidth ||
      bgColor !== nextProps.bgColor ||
      timeout !== nextProps.timeout
    ) {
      storage.remove(name);
      this.load();
    } else {
      this.bindEventFunc(nextProps);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.loading !== nextState.loading;
  }

  componentWillUnmount() {
    cleanUpScript();
  }

  load() {
    if (!(window && window.document)) return;

    const { data } = this.props;

    this.setState({
      loading: true,
    });

    if (isFunction(data)) {
      data().then(d => {
        this.tryInit(d);
      });
    } else {
      this.tryInit(data);
    }
  }

  tryInit(data) {
    const {
      name,
      width,
      product,
      lang,
      protocol,
      area,
      nextWidth,
      bgColor,
      timeout,
    } = this.props;

    try {
      // http://docs.geetest.com/install/client/web-front/
      initGeetest(
        {
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: !!data.new_captcha,
          width,
          product,
          lang,
          protocol,
          area,
          next_width: nextWidth,
          bg_color: bgColor,
          timeout,
        },
        ins => {
          // 1.防止重复调用 2.offline 模式没有这些方法所以判断一下
          if (isFunction(ins.onReady))
            ins.onReady(() => {
              if (typeof ins.readyFunc === 'function') ins.readyFunc();
            });
          if (isFunction(ins.onSuccess))
            ins.onSuccess(() => {
              if (typeof ins.successFunc === 'function') ins.successFunc();
            });
          if (isFunction(ins.onClose))
            ins.onClose(() => {
              if (typeof ins.closeFunc === 'function') ins.closeFunc();
            });
          if (isFunction(ins.onError))
            ins.onError(() => {
              if (typeof ins.errorFunc === 'function') ins.errorFunc();
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

          storage.add(name, ins);
          this.ins = ins;

          this.bindEventFunc(this.props);
          this.setState({
            loading: false,
          });

          this.show();
        },
      );
    } catch (e) {
      console.error(e); // eslint-disable-line
    }
  }

  bindEventFunc(props) {
    const { ins } = this;
    const { onReady, onSuccess, onClose, onError } = props;
    if (ins) {
      ins.handleReady(onReady);
      ins.handleSuccess(() => onSuccess(ins.getValidate()));
      ins.handleClose(onClose);
      ins.handleError(onError);
    }
  }

  show() {
    const { product } = this.props;
    const { ins, box } = this;
    if (ins && product !== 'bind') ins.appendTo(box);
  }

  render() {
    const { product } = this.props;
    const { loading } = this.state;

    const loadingTip = loading ? <span> loading... </span> : null;
    return (
      <div
        style={{
          display: product === 'bind' ? 'none' : 'block',
          height: 44,
        }}
      >
        <div style={{ display: loading ? 'block' : 'none' }}>{loadingTip}</div>
        <div
          style={{ display: loading ? 'none' : 'block' }}
          ref={box => {
            this.box = box;
          }}
        />
      </div>
    );
  }
}

RGCaptcha.propTypes = {
  name: PropTypes.string.isRequired,
  // 用于初始化的数据
  data: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      gt: PropTypes.string.isRequired,
      challenge: PropTypes.string.isRequired,
      success: PropTypes.number.isRequired,
      new_captcha: PropTypes.bool,
    }),
  ]).isRequired,
  // 配置参数
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  product: PropTypes.oneOf(['popup', 'float', 'custom', 'bind']),
  lang: PropTypes.oneOf(['zh-cn', 'en']),
  protocol: PropTypes.oneOf(['http://', 'https://']),
  area: PropTypes.string,
  nextWidth: PropTypes.string,
  bgColor: PropTypes.string,
  timeout: PropTypes.number,
  // 事件
  onReady: PropTypes.func,
  onSuccess: PropTypes.func,
  onClose: PropTypes.func,
  onError: PropTypes.func,
};

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
  onError: null,
};

export default RGCaptcha;
