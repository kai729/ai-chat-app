declare module "react-syntax-highlighter" {
  import { ComponentType } from "react";

  export const Prism: {
    [key: string]: ComponentType<any>;
  };
}

declare module "react-syntax-highlighter/dist/esm/styles/prism" {
  export const oneDark: { [key: string]: React.CSSProperties };
}
