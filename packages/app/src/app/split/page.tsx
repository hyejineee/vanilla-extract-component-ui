"use client";
import { useEffect, useState } from "react";
import { Box } from "ui/box";
import { Button } from "ui/split/button";
import { TextArea } from "ui/split/textarea";

import styles from "./style.module.css";

import "ui/split/button.css";
import "ui/split/textarea.css";
import "ui/split/variables.css";
import { setThemeConfig } from "ui/system";
import { sprinkles, theme } from "./test.css";

setThemeConfig({
  theme,
  sprinkles,
});

const Page = () => {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  useEffect(() => {
    const origin = document.documentElement.style;
    document.documentElement.style.setProperty("color-scheme", theme);

    return () => {
      for (const key in origin) {
        document.documentElement.style.setProperty(key, origin[key]);
      }
    };
  }, [theme]);

  return (
    <div className={styles.root}>
      <Box bgColor="bg.error.default">
        <Button
          onClick={() =>
            setTheme((theme) => (theme === "light" ? "dark" : "light"))
          }
        >
          {theme}
        </Button>
        <TextArea />
        <Button>button</Button>
      </Box>
    </div>
  );
};

export default Page;
