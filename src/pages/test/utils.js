// 异步js
export const asyncJS = (src) => {
    var jsapi = document.createElement('script');
    jsapi.charset = 'utf-8';
    jsapi.src = src;
    document.head.appendChild(jsapi);
  };