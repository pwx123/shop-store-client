import pkg from "./package";

export default {
  mode: "universal",

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      {charset: "utf-8"},
      {name: "viewport", content: "width=device-width, initial-scale=1"},
      {hid: "description", name: "description", content: pkg.description}
    ],
    link: [
      {rel: "icon", type: "image/x-icon", href: "/favicon.ico"}
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: {color: "#07c160"},

  /*
  ** Global CSS
  */
  css: [
    "assets/main.css"
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    "~/plugins/axios",
    {src: "~plugins/vant", ssr: true}
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    "@nuxtjs/axios",
  ],

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extractCSS: true,
    extend(config, ctx) {
    }
  },
  server: {
    port: 8081
  },
  axios: {
    baseURL: "http://127.0.0.1:3001",
    credentials: true
  }
};
