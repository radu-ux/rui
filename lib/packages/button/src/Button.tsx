import * as React from "react";
import { useButton, AriaButtonProps } from "@react-aria/button";
import { useHover } from "@react-aria/interactions";
import { tv } from "tailwind-variants";

import { clsx } from "rui-component-utils";
import { Loader } from "lucide-react";

const button = tv({
  base: "py-2 px-4 text-white rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 duration-150",
  variants: {
    variant: {
      primary:
        "bg-rui-900 focus-visible:ring-rui-400 disabled:opacity-50 aria-[disabled]:opacity-50",
      danger:
        "bg-rui-red-500 focus-visible:ring-rui-red-200 disabled:opacity-50 aria-[disabled]:opacity-50",
      secondary:
        "bg-rui-100 text-rui-900 focus-visible:ring-rui-200 disabled:bg-rui-200 disabled:opacity-50 aria-[disabled]:opacity-50",
      outline:
        "bg-whiite text-rui-900 border border-rui-200 focus-visible:ring-rui-200 disabled:bg-rui-200 disabled:opacity-50 aria-[disabled]:opacity-50",
      ghost:
        "bg-white text-rui-900 focus-visible:ring-rui-200 disabled:bg-rui-200 disabled:opacity-50 aria-[disabled]:bg-rui-200 aria-[disabled]:opacity-50",
      link: "bg-inherit text-rui-900 focus-visible:ring-rui-100 disabled:bg-rui-200 disabled:opacity-50 aria-[disabled]:bg-rui-200 aria-[disabled]:opacity-50",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

const buttonHover = tv({
  variants: {
    variant: {
      primary: "duration-150 bg-rui-700",
      danger: "bg-rui-red-600",
      secondary: "bg-rui-200",
      outline: "bg-rui-100",
      ghost: "bg-rui-100",
      link: "underline",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

interface Props extends AriaButtonProps {
  variant?: keyof typeof button.variants.variant;
  icon?: React.ReactNode;
  loading?: boolean;
}

export function Button({ variant, icon, loading, ...props }: Props) {
  const ref = React.useRef<React.ElementRef<"button">>(null);
  const { buttonProps, isPressed } = useButton(props, ref);
  const { hoverProps, isHovered } = useHover(props);
  const { className, ...restButtonProps } = buttonProps;

  const Comp = props.elementType ?? "button";
  const isLink = variant === "link";
  const hasIcon = !!icon;
  const disabled = loading ? true : buttonProps.disabled;
  const disabledCausedByLoading = loading && disabled;
  const supportsDisabledProps =
    !props.elementType || props.elementType === "button";
  const variantClassName = button({ variant });
  const hoverClassName = isHovered ? buttonHover({ variant }) : "";

  return (
    <Comp
      {...restButtonProps}
      {...hoverProps}
      disabled={supportsDisabledProps ? disabled : undefined}
      className={clsx(
        variantClassName,
        hoverClassName,
        isPressed && !isLink && "scale-90",
        hasIcon && "flex gap-2 items-center",
        disabledCausedByLoading && !isLink && "flex gap-2 items-center",
        className
      )}
    >
      {disabledCausedByLoading && !isLink ? (
        <span className="animate-in zoom-in-0 duration-300">
          <Loader className="animate-spin  w-4 h-4" />
        </span>
      ) : (
        icon
      )}
      {props.children}
    </Comp>
  );
}
