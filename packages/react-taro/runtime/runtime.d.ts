declare namespace EluxRuntime {
  interface ENV {
    __taroAppConfig: {
      tabBar: {list: {pagePath: string}[]};
    };
  }
}
declare namespace Taro {
  let onUnhandledRejection: (callback: (error: {reason: any}) => void) => void;
}
declare interface Process {
  env: {
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'jd';
  };
}
