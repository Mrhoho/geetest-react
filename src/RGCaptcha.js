/* eslint-disable react/no-unused-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import isFunction from 'lodash/isFunction';
import defaults from 'lodash/defaults';
import storage from './storage';

import DefaultLoading from './Loading';

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
    this.busy = false;
    this.showed = false;
    this.mounted = false;
    this.hasChanged = false;
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    this.mounted = true;
    this.load(false);
  }

  componentDidUpdate() {
    if (this.busy) {
      this.hasChanged = true;
      return;
    }
    this.load(true).finally(() => {
      if (this.hasChanged) {
        this.hasChanged = false;
        this.load(true);
      }
    });
  }

  componentWillUnmount() {
    const { name } = this.props;

    cleanUpScript();
    storage.remove(name);
    this.mounted = false;
  }

  async load(useCache) {
    if (!(window && window.document) || this.busy || !this.mounted) return;

    this.busy = true;

    const data = await this.loadData(useCache);
    const ignoreData = useCache && isFunction(data);

    await this.loadIns(data, useCache, ignoreData);
    this.busy = false;
  }

  async loadData(useCache) {
    const { data } = this.props;

    let fData = data;
    if (isFunction(data) && !useCache) {
      await data()
        .then(d => {
          fData = d;
        })
        .catch(() => {
          console.error('failed to fetch data'); // eslint-disable-line no-console
        });
    }

    return fData;
  }

  async loadIns(data, useCache, ignoreData) {
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

    const config = {
      width,
      product,
      lang,
      protocol,
      area,
      next_width: nextWidth,
      bg_color: bgColor,
      timeout,
    };

    await storage
      .create(name, config, data, useCache, ignoreData)
      .then(ins => {
        if (ins !== this.ins) this.showed = false;
        this.ins = ins;
        this.bindEventFunc(this.props);
        this.show();
      })
      .catch(() => {
        console.error('failed to initialize'); // eslint-disable-line no-console
      })
      .finally(() => {
        if (this.mounted) {
          this.setState({
            loading: false,
          });
        }
      });
  }

  bindEventFunc(props) {
    const { ins } = this;
    const { onReady, onSuccess, onClose, onError } = props;
    if (ins && ins.hasBuildEventFunc) {
      ins.handleReady(onReady);
      ins.handleSuccess(() => onSuccess(ins.getValidate()));
      ins.handleClose(onClose);
      ins.handleError(onError);
    }
  }

  show() {
    const { product } = this.props;
    const { ins, box, showed } = this;
    if (ins && box && !showed && product !== 'bind') {
      while (box.firstChild) {
        box.removeChild(box.firstChild);
      }
      ins.appendTo(box);
      this.showed = true;
    }
  }

  render() {
    const {
      product,
      loadingComponent,
      loadingText,
      style = {},
      className,
    } = this.props;
    const { loading } = this.state;

    let LoadingTemp;

    if (loadingComponent) {
      LoadingTemp = React.createElement(loadingComponent, {
        loading,
      });
    } else {
      LoadingTemp = <DefaultLoading loading={loading} text={loadingText} />;
    }

    const dStyle = defaults(style, {
      display: product === 'bind' ? 'none' : 'block',
      height: 44,
    });

    return (
      <div style={dStyle} className={className}>
        {LoadingTemp}
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
  lang: PropTypes.oneOf(['zh-cn', 'zh-hk', 'zh-tw', 'en', 'ja', 'ko', 'ru', 'ar', 'es', 'pt-pt', 'fr', 'de']),
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
  //
  loadingComponent: PropTypes.func,
  loadingText: PropTypes.string,
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  className: PropTypes.string,
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
  loadingComponent: null,
  loadingText: 'loading...',
  style: null,
  className: '',
};

export default RGCaptcha;
