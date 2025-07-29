declare module "react-syntax-highlighter" {
  import * as React from "react";

  export const Prism: {
    [key: string]: React.FC<Record<string, unknown>>;
  };
}

declare module "react-syntax-highlighter/dist/esm/styles/prism" {
  export const oneDark: { [key: string]: React.CSSProperties };
}
