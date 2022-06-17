module.exports = {
  publicPath: process.env.VUE_APP_BASE_PATH,
  transpileDependencies: [
    'vuetify'
  ],
  devServer:{
    proxy:{
      '/api':{
        target:process.env.VUE_APP_API_URL,
        changeOrigin:true,
      },
    },
  }
}
