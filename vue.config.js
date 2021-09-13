module.exports = {
    // 基本路径
    publicPath: "./",
    // 输出文件目录
    outputDir: "dyzhcg",
    lintOnSave: false,
    devServer: {
        open: process.platform === "darwin",
        host: "0.0.0.0",
        port: 5000,
        https: false,
        hotOnly: false,
        proxy: {
            '/map': {
                target: 'https://192.168.80.189:6443',
                changeOrigin: true,
                pathRewrite: {
                    '^/map': ''
                }
            },
            '/wfsmap':{
            	target: 'http://192.168.80.103:3000',
            	changeOrigin: true,
            	timeout: 60 * 60 * 1000,
            	ws: true,
            	pathRewrite: {
            	    '^/wfsmap': ''
            	}
            }
        }
    }
};
