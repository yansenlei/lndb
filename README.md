# Lndb

[![npm version](https://badge.fury.io/js/lndb.svg)](https://badge.fury.io/js/lndb)
[![Build Status](https://travis-ci.org/yansenlei/lndb.svg?branch=master)](https://travis-ci.org/yansenlei/lndb)
[![license](https://img.shields.io/npm/l/express.svg)](https://github.com/yansenlei/lndb/blob/master/LICENSE)

> :file_folder: lndb是基于本地文件系统封装的一套灵活的持久化存储数据库，支持Node、Electron等。

使用文件系统作为基础存储方式，并在上层读写时提供灵活的插件机制，这意味着你可以根据自己的需求定制读写功能，详细信息查看[插件机制](#插件机制)。



## 安装

```bash
$ npm install lndb
```

## 使用

![carbon (4).png](https://i.loli.net/2018/12/20/5c1b27e58c069.png)

## 读写信息说明
1. 默认情况下不论存入何种数据类型，通过`.get(key)`获取到的都是一个文件结构，这是为了可以自由的获取文件信息。
   如上面举例那样的`Object`类型数据默认存入`data.json`中：
    ```
      __lndb__/page/
        └── key
            └── data.json
    ```
    你通过`.get(key)`获取到的数据像这样：
    ```json
    {
      "data.json": {
        "path": "pro/__lndb__/page/key/data.json"
      },
      "data": {
        "hello": "lndb!"
      }
    }
    ```
    如果使用[内置插件](#内置插件)内的`unzip`这样的插件来存入文件，文件树像这样：
    ```
      __lndb__/page/
        └── key
            └── files
                ├── index.html
                └── about.html
    ```
    此时，你通过`.get(key)`获取到的数据像这样：
    ```json
    {
      "files": {
        "path": "pro/__lndb__/page/key/files/",
        "child": {
          "index.html": {
            "path": "pro/__lndb__/page/key/files/index.html"
          },
          "about.html": {
            "path": "pro/__lndb__/page/key/files/about.html"
          }
        }
      }
    }
    ```
2. 如果存入数据是如上面举例那样的`Object`类型，在读取时会默认加载数据信息可以通过`get(key).data`获取，如果需要更灵活的操作数据信息可以使用`lodash`插件。
3. 由于使用的是文件命名，所以命名上对符号(`\` `/`) 是敏感的，虽然程序会默认使用`__lndb__`来替换敏感符号后再命名文件，但是希望你在使用的时候注意规避敏感符号以保证程序正常运行。

## 插件机制
也许默认的读写操作并不能满足你的需求，值得一提的是，Lndb 的核心是可以灵活的扩展读写功能，你可以引入符合标准的插件来替换现有的读写功能:
```js
const demoPlugin = require('demo-plugin')
// add plugin
db.use('demo-plugin', demoPlugin, { "options": true})
// init instance
const pg = db.init('page')

pg.set('key', { hello: 'lndb!'}, {
  name: 'demo-plugin',
  options: {}
})
```
- .use(name, plugin, options)
  - `name`      唯一名称
  - `plugin`    插件对象
  - `options`   插件参数
- .set/.get(k, v, {name, options})
  - `name`      唯一名称
  - `options`   插件参数，替换`db.use()`时的预制参数

### 插件规范
现在你可以根据自己的需求编写自己的读取方式，但是你必须遵循必要的规范，插件模板看起来像这样：
```js
module.exports = {
  install(Ln, params = {}, options = {}){
    // 你的自定义操作

    // 调用文件获取
    Ln.fls.get(id)
    // 调用文件写入
    Ln.fls.set(params.id, params.value)
    // 获取当前数据保存路径
    Ln.fls.datapath

    return true
  }
}
```
目前插件允许你在`set()`,`get()`上做自定义操作。
插件内是一个对象，对象内函数名为`install`，函数带有三个参数：
- install(Ln, params, options)
  - `Ln`      当前读写上下文
  - `params`  读写时的参数 `{id, value}`
  - `options` 传入插件的配置信息

### 内置插件
内置插件默认已经存在于系统插件列表中，可以在`.get()` `.set()`直接使用

<details>
  <summary>
  <b>lodash</b>
  <p>

  读取扩展，使用lodash插件灵活读写，该插件参考了`lowdb`的使用方式，这可以很灵活的处理单个文件，具体参考[lodash文档](https://lodash.com/)
  
  </p>
  </summary>
  
```js
const pg = db.init('page')

const _ = pg.get('key', {
  name: 'lodash'
})
_.setState({hello: 'lndb!'}).write()
_.getState() // { hello: 'lndb!'}
_.has("hello").value() // true
_.update("hello", n => n.toUpperCase()).write() // update -> { hello: 'LNDB!!'}
```
#### lodash plugin API
- _.setState()
  - 写入数据到实例中
- _.getState()
  - 获取当前实例的数据
- _.update()
  - 更新数据
- _.read()
  - 读取磁盘中的数据到实例，返回实例
- _.write()
  - 所有写入操作需要调用`.write()`后才写入磁盘
</details>


<details>
  <summary>
  <b>unzip</b>
  <p>

  写入扩展，使用unzip写入zip文件时解压到指定目录下，意味着可以通过`.get()`方法获取到解压后的路径，便可使用里面的文件

  </p>
  </summary>

```js
pg.set('key', value, {
  name: 'unzip'
})

pg.get('key')
```
- `value` \<Buffer> | \<Base64>
</details>

## License
:smiley: 欢迎提交Issues或PR。

MIT - [yansenlei](https://github.com/yansenlei)
