// src/types/react-syntax-highlighter.d.ts
declare module "react-syntax-highlighter" {
  import { FC, ReactNode } from "react";

  export const Prism: {
    [language: string]: FC<{
      children: ReactNode;
      language?: string;
      style?: object;
      PreTag?: string;
      customStyle?: object;
    }>;
  };
}

declare module "react-syntax-highlighter/dist/cjs/styles/prism" {
  export const oneDark: { [key: string]: React.CSSProperties };
}
