import type { CSSUIObject, HTMLUIProps, ThemeProps } from "@yamada-ui/core"
import { forwardRef, ui } from "@yamada-ui/core"
import { createContext, cx, dataAttr } from "@yamada-ui/utils"
import { useMemo } from "react"

interface ButtonGroupOptions {
  /**
   * If `true`, the borderRadius of button that are direct children will be altered to look flushed together.
   *
   * @default false
   */
  attached?: boolean
  /**
   * The CSS `flex-direction` property.
   */
  direction?: CSSUIObject["flexDirection"]
  /**
   * If `true`, all wrapped button will be disabled.
   *
   * @default false
   */
  disabled?: boolean
  /**
   * If `true`, the borderRadius of button that are direct children will be altered to look flushed together.
   *
   * @default false
   *
   * @deprecated Use `attached` instead.
   */
  isAttached?: boolean
  /**
   * If `true`, all wrapped button will be disabled.
   *
   * @default false
   *
   * @deprecated Use `disabled` instead.
   */
  isDisabled?: boolean
}

export interface ButtonGroupProps
  extends Omit<HTMLUIProps, "direction">,
    ThemeProps<"Button">,
    ButtonGroupOptions {}

interface ButtonGroupContext extends ThemeProps<"Button"> {
  disabled?: boolean
}

const [ButtonGroupProvider, useButtonGroup] = createContext<ButtonGroupContext>(
  {
    name: "ButtonGroupContext",
    strict: false,
  },
)

export { useButtonGroup }

export const ButtonGroup = forwardRef<ButtonGroupProps, "div">(
  (
    {
      className,
      size,
      variant,
      attached,
      columnGap,
      direction: flexDirection,
      disabled,
      gap,
      isAttached,
      isDisabled,
      rowGap,
      ...rest
    },
    ref,
  ) => {
    const isColumn =
      flexDirection === "column" || flexDirection === "column-reverse"

    attached ??= isAttached
    disabled ??= isDisabled

    const css: CSSUIObject = {
      display: "inline-flex",
      flexDirection,
    }

    const context: ButtonGroupContext = useMemo(
      () => ({ size, variant, disabled }),
      [size, variant, disabled],
    )

    if (attached) {
      Object.assign(css, {
        "> *:first-of-type:not(:last-of-type)": isColumn
          ? { borderBottomRadius: 0 }
          : { borderRightRadius: 0, borderRightWidth: "0px" },
        "> *:not(:first-of-type):last-of-type": isColumn
          ? { borderTopRadius: 0, borderTopWidth: "0px" }
          : { borderLeftRadius: 0 },
        "> *:not(:first-of-type):not(:last-of-type)": isColumn
          ? { borderRadius: 0, borderTopWidth: "0px" }
          : { borderRadius: 0, borderRightWidth: "0px" },
      })
    } else {
      Object.assign(css, {
        columnGap,
        gap,
        rowGap,
      })
    }

    return (
      <ButtonGroupProvider value={context}>
        <ui.div
          ref={ref}
          className={cx("ui-button-group", className)}
          data-attached={dataAttr(attached)}
          role="group"
          __css={css}
          {...rest}
        />
      </ButtonGroupProvider>
    )
  },
)

ButtonGroup.displayName = "ButtonGroup"
ButtonGroup.__ui__ = "ButtonGroup"
