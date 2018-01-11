
react-geetest-captcha
=======================

a react.js component for GEETEST

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Install](#install)
- [Usage](#usage)
- [API](#api)
  - [`<RGCaptcha />`](#rgcaptcha-)
    - [RGCaptcha props](#rgcaptcha-props)
      - [`name: string`](#name-string)
      - [`data: () => Promise<dataObject, any> | dataObject`](#data---promisedataobject-any--dataobject)
        - [The "dataObject":](#the-dataobject)
      - [`width: string | number`](#width-string--number)
      - [`product: 'popup' | 'float' | 'custom' | 'bind'`](#product-popup--float--custom--bind)
      - [`lang: 'zh-cn' | 'en'`](#lang-zh-cn--en)
      - [`protocol: 'http://' | 'https://'`](#protocol-http--https)
      - [`area: string`](#area-string)
      - [`nextWidth: string`](#nextwidth-string)
      - [`bgColor: string`](#bgcolor-string)
      - [`timeout: number`](#timeout-number)
      - [`onReady: () => any`](#onready---any)
      - [`onSuccess: (result: resultObject) => any`](#onsuccess-result-resultobject--any)
        - [The "resultObject":](#the-resultobject)
      - [`onClose: () => any`](#onclose---any)
      - [`onError: () => any`](#onerror---any)
      - [`shouldReinitialize: (props: Props, nextProps: Props) => boolean`](#shouldreinitialize-props-props-nextprops-props--boolean)
  - [`appendTo: (name: stirng) => any`](#appendto-name-stirng--any)
  - [`bindForm: (name: stirng, position: string) => any`](#bindform-name-stirng-position-string--any)
  - [`getValidate: (name: string) => any`](#getvalidate-name-string--any)
  - [`reset: (name: string) => any`](#reset-name-string--any)
  - [`verify: (name: string) => any`](#verify-name-string--any)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```sh
npm install react-geetest-captcha
```

## Usage

```js
import React from 'react';
import { RGCaptcha, reset } from 'react-geetest-captcha';

const CAPTCHA_NAME = 'demoCaptcha';

class Demo extends React.Component {
  handleSuccess() {

  }

  handleError() {
    reset(CAPTCHA_NAME);
  }

  render() {
    return (
      <RGCaptcha
        name={CAPTCHA_NAME}
        width="100%"
        onSuccess={this.handleSuccess}
        onError={this.handleError}
        data={() =>
          ajax
            .then(resp => {
              const { captcha } = (resp && resp.data) || {};
              // console.log(captcha);
              // {
              //   "gt": "e385d274eeedb650fa008875ff7b14a2",
              //   "challenge": "f4873d2af972a38811814f644920b8ab",
              //   "success": 1,
              // }
              return captcha;
            })
        }
      />
    );
  }
}
```
## API

### `<RGCaptcha />`

#### RGCaptcha props

##### `name: string`

##### `data: () => Promise<dataObject, any> | dataObject`

###### The "dataObject":
* `gt: string`
* `challenge: string`
* `success: number`
* `new_captcha?: boolean`

##### `width: string | number`

##### `product: 'popup' | 'float' | 'custom' | 'bind'`

##### `lang: 'zh-cn' | 'en'`

##### `protocol: 'http://' | 'https://'`

##### `area: string`

##### `nextWidth: string`

##### `bgColor: string`

##### `timeout: number`

##### `onReady: () => any`

##### `onSuccess: (result: resultObject) => any`

###### The "resultObject":

```js
resultObject = instance.getValidate();
// console.log(resultObject);
// {
//   geetest_challenge: "1ef13c67010acf6c282756145def60faag",
//   geetest_validate: "2ea11528e5d96c06e4a14d9a1dfc5916",
//   geetest_seccode: "2ea11528e5d96c06e4a14d9a1dfc5916|jordan",
// }
```

##### `onClose: () => any`

##### `onError: () => any`

##### `shouldReinitialize: (props: Props, nextProps: Props) => boolean`

### `appendTo: (name: stirng) => any`

a proxy method for GEETEST instance.appendTo method

### `bindForm: (name: stirng, position: string) => any`

a proxy method for GEETEST instance.bindForm method

### `getValidate: (name: string) => any`

a proxy method for GEETEST instance.getValidate method

### `reset: (name: string) => any`

a proxy method for GEETEST instance.reset method

### `verify: (name: string) => any`

a proxy method for GEETEST instance.verify method
