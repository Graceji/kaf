---
next: /guide/ui-framework/react.html
---

# Mutable与Immutable

数据管理本质上分为2大类：`Mutable(可变数据)`与`Immutable(不可变数据)`，Elux同时支持2种模式。

```ts
import {setCoreConfig} from '@aimkaf/core';

//设置当前数据管理模式为可变数据模式
setCoreConfig({
  MutableData: true,
})
```

> 为了用户使用方便和避免随意更改，已经将模式固化在各`组合包`中了，所以用户无需设置。

## Immutable(不可变数据)

不可变数据的管理框架，典型代表是Redux，它要求每次更新State要返回一个新数据，不能修改原数据。

```ts
// src/modules/stage/model.ts

export class Model extends BaseModel {
    @reducer
    protected putCurUser(curUser: CurUser): ModuleState {
        return {...this.state, curUser};
    }
}
```

## Mutable(可变数据)

可变数据的管理框架，典型代表有Vuex/Mobx，每次更新State的时候可以直接修改原数据。

```ts
// src/modules/stage/model.ts

export class Model extends BaseModel {
    @reducer
    protected putCurUser(curUser: CurUser): ModuleState {
        this.state.curUser = curUser;
    }
}
```

## 数据模式与UI框架

从职能上来说，应当有数据管理框架、数据模式框架、UI渲染框架三者之分。

> 其中Immutable不可变数据模式比较简单，所以不需要专门的数据模式框架

- React属于`UI渲染框架`
- Vue包含了`数据模式框架`+`UI渲染框架`
- Mobx包含了`数据模式框架`+`数据管理框架`
- Vuex、Redux仅属于`数据管理框架`

Elux内置了`数据管理框架`，未包含`数据模式框架`和`UI渲染框架`，所以Elux需要配合其它框架使用：

- Elux使用`Immutable`模式的可选的组合有：
  - Elux+React
- Elux使用`Mutable`模式的可选的组合有：
  - Elux+Vue
  - Elux+Mobx+React

## Elux中的组合包

Elux中根据用户习惯，封装了几种常用的组合包：

- React组合包，默认使用Immutable模式
- Vue组合包，默认使用Mutable模式

::: tip 未提供React+Mobx(ReactMutable模式)组合包

Elux中接入Mobx并不难，但所谓React+Mobx是更复杂的Vue。加上现在Vue3已经成熟，使用JSX写Vue3与React很像了，`JSX+Vue3`相比`React+Mobx`是更佳的Mutable方案。

:::
