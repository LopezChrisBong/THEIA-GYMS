// vuetify.js
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import colors from "vuetify/lib/util/colors";
import 'vuetify/styles'

export default createVuetify({
  components,
  directives,
  icons: {
    iconfont: "md",  // If you want to use Material Design Icons (md)
  },
  theme: {
    themes: {
      light: {
        primary1: colors.grey.lighten2,
        primary2: colors.grey.lighten5,
        secondary1: colors.grey.lighten2,
        secondary2: colors.grey.darken2,
        success: colors.grey.darken4,
        error4: colors.green.lighten5,
        white: colors.white,
        DarkWhite: colors.grey.lighten3,
        header: colors.green.darken2,
        notifUnOpen: "#dff2bf",
        notifUnOpenBorder: "#d3eda7",
        submitBtns: "#d6a89c",
      },
      dark: {
        primary1: colors.grey.darken4,
        primary2: colors.grey.darken4,
        secondary1: colors.grey.darken3,
        secondary2: colors.grey.lighten2,
        success: colors.grey.lighten2,
        error4: colors.grey.darken4,
        white: colors.white,
        DarkWhite: colors.grey.darken4,
        header: colors.white,
        submitBtns: "#d6a89c",
      },
    },
  },
  //   display: {
  //   mobileBreakpoint: 'xs',
  //   thresholds: {
  //     xs: 9999, // forces everything to be treated as 'xs'
  //     sm: 9999,
  //     md: 9999,
  //     lg: 9999,
  //     xl: 9999,
  //   },
  // },
});
