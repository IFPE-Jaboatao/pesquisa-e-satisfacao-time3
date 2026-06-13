import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  output: "standalone",
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
  },
};

export default withFlowbiteReact(nextConfig);
