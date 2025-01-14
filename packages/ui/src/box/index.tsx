import { getThemeConfig } from "@ui/system/createThemeConfig/createConfig";
import { splitStyleProps } from "@ui/util/styles";
import type { UtilStyleProps } from "@ui/util/styles/style.types";
import type { ChildrenProps } from "@ui/util/types";

import { polyForwardRef } from "@ui/util/types/polymorphic";

interface BoxProps extends UtilStyleProps, ChildrenProps {}

export const Box = polyForwardRef<"div", BoxProps>(
  ({ as: Element = "div", ...props }, ref) => {
    const styleConfig = getThemeConfig();

    // styleConfig.sprinkles가 존재하는지 확인
    if (!styleConfig.sprinkles) {
      console.warn("Theme sprinkles are not defined");
      return <Element ref={ref} {...props} />;
    }

    const { styleProps, restProps } = splitStyleProps(
      props,
      styleConfig.sprinkles
    );

    return (
      <Element
        ref={ref}
        {...restProps}
        className={styleConfig.sprinkles({ ...styleProps })}
      />
    );
  }
);
