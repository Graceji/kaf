<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@elux/vue-taro](./vue-taro.md) &gt; [BaseModel](./vue-taro.basemodel.md) &gt; [\_loadingState](./vue-taro.basemodel._loadingstate.md)

## BaseModel.\_loadingState() method

reducer 监听 `moduleName._loadingState` Action，合并至当前状态

<b>Signature:</b>

```typescript
protected _loadingState(loadingState: {
        [group: string]: LoadingState;
    }): TModuleState;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  loadingState | { \[group: string\]: [LoadingState](./vue-taro.loadingstate.md)<!-- -->; } |  |

<b>Returns:</b>

TModuleState

## Remarks

执行 effect 时会派发 `moduleName._loadingState` Action
