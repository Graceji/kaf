<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@elux/react-web](./react-web.md) &gt; [URouter](./react-web.urouter.md)

## URouter interface

\*

<b>Signature:</b>

```typescript
export interface URouter<S extends RouteState = RouteState, T = unknown> 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [initialize](./react-web.urouter.initialize.md) | Promise&lt;[RouteState](./react-web.routestate.md)<!-- -->&gt; |  |
|  [location](./react-web.urouter.location.md) | [ULocationTransform](./react-web.ulocationtransform.md) |  |
|  [nativeData](./react-web.urouter.nativedata.md) | T |  |
|  [routeState](./react-web.urouter.routestate.md) | S |  |

## Methods

|  Method | Description |
|  --- | --- |
|  [addListener(name, callback)](./react-web.urouter.addlistener.md) |  |
|  [back(stepOrKey, root, options, nonblocking)](./react-web.urouter.back.md) |  |
|  [extendCurrent(params, pagename)](./react-web.urouter.extendcurrent.md) |  |
|  [findRecordByKey(key)](./react-web.urouter.findrecordbykey.md) |  |
|  [findRecordByStep(delta, rootOnly)](./react-web.urouter.findrecordbystep.md) |  |
|  [getCurrentPages()](./react-web.urouter.getcurrentpages.md) |  |
|  [getHistoryLength(root)](./react-web.urouter.gethistorylength.md) |  |
|  [push(dataOrUrl, root, nonblocking)](./react-web.urouter.push.md) |  |
|  [relaunch(dataOrUrl, root, nonblocking)](./react-web.urouter.relaunch.md) |  |
|  [replace(dataOrUrl, root, nonblocking)](./react-web.urouter.replace.md) |  |
