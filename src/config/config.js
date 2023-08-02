// 自定义配置，参考 ./default/setting.config.js，需要自定义的属性在这里配置即可
module.exports = {
  theme: {
    color: '#1890ff',
    mode: 'dark',
  },
  asyncRoutes:false,
  multiPage: true,
  animate: {
    name: 'lightSpeed',
    direction: 'left'
  },
  // systemName:'聊城市政府网站群统一技术平台',
  systemName:'济南市政务公开数字化管理平台',
  // systemName:'数字嘉明',
  copyright: '尚可网络 融公开v3.1.1',      //copyright
  // copyright: '2022 嘉明经济开发区',     //copyright
  footerLinks: [
    //页面底部链接，
    //{link: '链接地址', name: '名称/显示文字', icon: '图标，支持 ant design vue 图标库'}
    {link: '', name: '尚可网络 融公开v3.1.1'},
    // {link: '', name: '数字嘉明'},
  ],
}
