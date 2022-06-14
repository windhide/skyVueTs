const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true
})
module.exports = { 
    devServer: {
        open: false,
        port: 8081,
        proxy: {
            '/api': {
                target: 'http://localhost:8080/', // target host
                ws: true, // proxy websockets 
                changeOrigin: true, // needed for virtual hosted sites
                pathRewrite: {
                    '^/api': '' // rewrite path
                }
            },
        },
    }
}