import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const colors = {
  light: {
    primary: "purple.700",
    secondary: "purple.500",
    tertiary: "purple.300",
    bg: "gray.50",
  },
  dark: {
    primary: "purple.300",
    secondary: "purple.500",
    tertiary: "purple.700",
    bg: "gray.800",
  },
};

const theme = extendTheme({
  config,
  colors: {
    primary: {
      light: colors.light.primary,
      dark: colors.dark.primary,
    },
    secondary: {
      light: colors.light.secondary,
      dark: colors.dark.secondary,
    },
    tertiary: {
      light: colors.light.tertiary,
      dark: colors.dark.tertiary,
    },
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === "dark" ? colors.dark.bg : colors.light.bg,
        color:
          props.colorMode === "dark"
            ? colors.dark.primary
            : colors.light.primary,
      },
    }),
  },
  components: {
    Button: {
      variants: {
        solid: (props: any) => ({
          bg:
            props.colorMode === "dark"
              ? colors.dark.primary
              : colors.light.primary,
          color: "white",
          _hover: {
            bg:
              props.colorMode === "dark"
                ? colors.dark.secondary
                : colors.light.secondary,
          },
        }),
      },
    },
    Input: {
      variants: {
        outline: (props: any) => ({
          field: {
            bg: props.colorMode === "dark" ? colors.dark.bg : colors.light.bg,
            _hover: {
              borderColor:
                props.colorMode === "dark"
                  ? colors.dark.primary
                  : colors.light.primary,
            },
            _focus: {
              borderColor:
                props.colorMode === "dark"
                  ? colors.dark.primary
                  : colors.light.primary,
              boxShadow: `0 0 0 1px ${
                props.colorMode === "dark" ? "mediumpurple" : "rebeccapurple"
              }`,
            },
          },
        }),
      },
      // Definir 'outline' como a variante padrão
      defaultProps: {
        variant: "outline", // A variante padrão será 'outline'
      },
    },
    Link: {
      baseStyle: (props: any) => ({
        textDecoration: "none",
        _hover: {
          textDecoration: "underline",
          color:
            props.colorMode === "dark"
              ? colors.dark.secondary
              : colors.light.secondary, // Cor personalizada ao focar, com base no tema
        },
      }),
    },
  },
});

export default theme;
