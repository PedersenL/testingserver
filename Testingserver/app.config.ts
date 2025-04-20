import { defineConfig } from "@tanstack/react-start/config";
import tsConfigPaths from "vite-tsconfig-paths";
import { env } from "./src/utils/env";

export default defineConfig({
  tsr: {
    appDirectory: "src",
  },
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
    ],
    // @ts-ignore
    server: {
      allowedHosts: env.BASE_URL ? [env.BASE_URL.split("://")[1]] : undefined,
    },
  },
});
