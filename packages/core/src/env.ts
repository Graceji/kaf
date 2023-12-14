/// <reference path="../runtime/runtime.d.ts" />
declare const window: any;
declare const global: any;
declare const module: any;
declare const self: any;
declare const btoa: any;
declare const atob: any;
declare const Buffer: any;

let root: any;
if (typeof self !== "undefined") {
  root = self;
} else if (typeof window !== "undefined") {
  root = window;
} else if (typeof global !== "undefined") {
  root = global;
} else if (typeof module !== "undefined") {
  root = module;
} else {
  root = new Function("return this")();
}

/**
 * 运行环境的引用
 *
 * @remarks
 * - 浏览器环境下，该变量指向 window
 *
 * - 服务器环境下，该变量指向 global
 *
 * @public
 */
const env: KAF.ENV = root;

export default env;
