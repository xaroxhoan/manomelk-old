// You can customize the template with the help of this file

//Template config options
const themeConfig = {
  app: {
    appName: "مدیریت من و ملک",
    appLogoImage: require("@src/assets/images/logo/logo.png").default
  },
  layout: {
    isRTL: true,
    skin: "semi-dark", // light, dark, bordered, semi-dark
    routerTransition: "fadeIn", // fadeIn, fadeInLeft, zoomIn, none or check this for more transition https://animate.style/
    type: "vertical", // vertical, horizontal
    contentWidth: "full", // full, boxed
    menu: {
      isHidden: false,
      isCollapsed: false
    },
    navbar: {
      // ? For horizontal menu, navbar type will work for navMenu type
      type: "floating", // static , sticky , floating, hidden
      backgroundColor: "white" // BS color options [primary, success, etc]
    },
    footer: {
      type: "hidden" // static, sticky, hidden
    },
    customizer: false,
    scrollTop: true, // Enable scroll to top button
    toastPosition: 'top-right' // top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
  }
}

export default themeConfig
