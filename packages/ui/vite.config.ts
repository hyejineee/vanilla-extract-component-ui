import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react-swc";
import postcssPresetEnv from "postcss-preset-env";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

import { peerDependencies } from "./package.json";

const shared = {
  external: Object.keys(peerDependencies ?? {}),
  postcss: {
    plugins: [
      postcssPresetEnv({
        browsers: ["> 0.2% and not dead"],
        features: {
          "color-mix": true,
          "light-dark-function": true,
          "media-query-ranges": true,
          "cascade-layers": true,
        },
      }),
    ],
  },
};

const vanillaExtract = defineConfig({
  build: {
    sourcemap: true,

    lib: {
      entry: {
        index: "src/index.ts",
      },
    },
    rollupOptions: {
      output: [
        {
          dir: "dist/vanilla-extract",
          format: "es",
          manualChunks(id) {
            if (id.includes(".css.ts")) {
              return `__styles/${id
                ?.split("/")
                ?.pop()
                ?.replace(".css.ts", ".css.js")}`;
            }
          },
          chunkFileNames({ name }) {
            return name;
          },
        },
        {
          dir: "dist/vanilla-extract",
          format: "cjs",
          manualChunks(id) {
            if (id.includes(".css.ts")) {
              return `__styles/${id
                ?.split("/")
                ?.pop()
                ?.replace(".css.ts", ".css.js")}`;
            }
          },
          chunkFileNames({ name }) {
            return name.replace(".css.js", ".css.cjs");
          },
        },
      ],
      external: [...shared.external, /^@vanilla-extract/],
    },
  },
  plugins: [react(), dts({ outDir: "dist/vanilla-extract" })],
});

const split = defineConfig({
  build: {
    sourcemap: true,
    cssCodeSplit: true,

    lib: {
      entry: {
        theme: "src/theme/index.ts",
        button: "src/button/index.tsx",
        textarea: "src/textarea/index.tsx",
        system: "src/system/index.ts",
        box: "src/box/index.tsx",
      },
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      output: {
        dir: "dist/split",
        assetFileNames({ name }) {
          return name?.replace(/\.css\.ts\.css$/, ".css") ?? "";
        },
      },
      external: shared.external,
    },
  },
  plugins: [
    react(),
    tsconfigPaths(),
    vanillaExtractPlugin(),
    dts({ outDir: "dist/split" }),
  ],
  css: {
    postcss: shared.postcss,
  },
});

const bundle = defineConfig({
  build: {
    cssMinify: true,
    minify: true,
    sourcemap: true,
    cssCodeSplit: false,

    lib: {
      entry: {
        index: "src/index.ts",
      },
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      output: {
        dir: "dist/bundle",
      },
      external: shared.external,
    },
  },
  plugins: [react(), vanillaExtractPlugin(), dts({ outDir: "dist/bundle" })],
  css: {
    postcss: shared.postcss,
  },
});

export default defineConfig(({ mode }) => {
  switch (mode) {
    case "ve":
      return vanillaExtract;
    case "split":
      return split;
    default:
      return bundle;
  }
});
