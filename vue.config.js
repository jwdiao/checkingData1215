module.exports = {
    // 基本路径
    baseUrl: process.env.NODE_ENV === 'production' ? 'http://10.19.7.69:8080/checkoutsys' : './', //测试线上地址
    // baseUrl: process.env.NODE_ENV === 'production' ? 'http://10.19.7.70:8080/checkoutsys' : './', //生产线上地址
    // baseUrl: process.env.NODE_ENV === 'production' ? 'http://127.0.0.1:8080/checkoutsys' : './', //本地测试

    // sanyShebei

    // 输出文件目录
    outputDir: 'checkoutsys',
    // webpack-dev-server 相关配置
    /* devServer: {
      port: 8888,
      host: 'localhost',
      // proxy: 'http://10.19.7.69:8083'
      // proxy: 'http://10.88.195.193:8083'
      // proxy: 'http://10.88.195.191:8083' //祁甲元
    } */
  }
