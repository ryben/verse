module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/verse/'
        : '/',
    devServer: {
        host: '0.0.0.0',
        disableHostCheck: true
    }
}