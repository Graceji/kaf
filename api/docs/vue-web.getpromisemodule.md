<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@elux/vue-web](./vue-web.md) &gt; [GetPromiseModule](./vue-web.getpromisemodule.md)

## GetPromiseModule type

\*

<b>Signature:</b>

```typescript
export declare type GetPromiseModule<T> = T extends Promise<{
    default: infer R;
}> ? R : T;
```