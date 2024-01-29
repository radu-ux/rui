import React from "react";
import { useButton } from "@react-aria/button";
import {
  useSelectProps,
  useSelectRefs,
  useSelectState,
} from "./SelectProvider";
import { clsx } from "rui-component-utils";
import { Node } from "@react-types/shared";
import { Overlay } from "@react-aria/overlays";
import { useListBox, useOption } from "@react-aria/listbox";

type SelectTriggerProps = {
  children?: React.ReactNode;
  className?: string;
};
type SelectTriggerSelectionItem<T> = {
  item: Node<T> | null;
};
type SelectMenuOptionProps<T> = {
  item: Node<T>;
};

function SelectTrigger(props: SelectTriggerProps) {
  const { triggerProps } = useSelectProps();
  const { triggerRef } = useSelectRefs();
  const { buttonProps } = useButton(
    { ...triggerProps.triggerProps, elementType: "div" },
    triggerRef
  );

  return (
    <div
      {...buttonProps}
      ref={triggerRef}
      className={clsx(
        "outline-none border focus-visible:border-blue-600",
        props.className
      )}
    >
      {props.children}
    </div>
  );
}

function SelectTriggerSelection<T extends object>() {
  const { listBoxState } = useSelectState();
  const selectedItems = [
    ...listBoxState.selectionManager.selectedKeys.keys(),
  ].map((key) => listBoxState.collection.getItem(key));

  return (
    <div className="flex border border-blue-500">
      {selectedItems.map(
        (item) =>
          item && (
            <SelectTriggerSelectionItem key={item.key} item={item as Node<T>} />
          )
      )}
    </div>
  );
}

function SelectTriggerSelectionItem<T extends object>(
  props: SelectTriggerSelectionItem<T>
) {
  return (
    <div className="border flex gap-1 min-w-[100px]">
      <p className="border-r">{props.item?.textValue}</p>
      <div className="hover:bg-black hover:text-white" data-id="remove-option">
        x
      </div>
    </div>
  );
}

function SelectTriggerClearSelection() {
  return null;
}

function SelectSearch() {
  const { searchProps } = useSelectProps();
  const { searchRef } = useSelectRefs();

  return (
    <input
      {...searchProps.inputProps}
      ref={searchRef}
      className="border border-green-500 outline-none w-full"
    />
  );
}

function SelectMenuOverlay(props: React.PropsWithChildren) {
  const [popoverWidth, setPopoverWidth] = React.useState(0);
  const { triggerProps, popoverProps } = useSelectProps();
  const { overlayTriggerState } = useSelectState();
  const { triggerRef, popoverRef } = useSelectRefs();

  React.useEffect(() => {
    let onResize = () => {
      if (triggerRef.current) {
        setPopoverWidth(triggerRef.current?.offsetWidth);
      }
    };

    onResize();

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <Overlay {...triggerProps.overlayProps}>
      <div
        {...popoverProps.popoverProps}
        ref={popoverRef}
        className="shadow-md"
        style={{ ...popoverProps.popoverProps.style, width: popoverWidth }}
      >
        {overlayTriggerState.isOpen && props.children}
      </div>
    </Overlay>
  );
}

function SelectMenu<T extends object>() {
  const { listBoxState } = useSelectState();
  const { listBoxProps: rootListBoxProps } = useSelectProps();
  const { listBoxRef } = useSelectRefs();
  const listBoxProps = useListBox(
    { "aria-label": "rui-select-menu", ...rootListBoxProps },
    listBoxState,
    listBoxRef
  );
  const displayCollection =
    listBoxState.filteredCollection ?? listBoxState.collection;

  return (
    <div className="flex flex-col gap-2">
      <ul
        {...listBoxProps.labelProps}
        ref={listBoxRef}
        className="max-h-[200px]"
      >
        {displayCollection.size === 0 && (
          <li className="flex items-center justify-center h-full border">
            <p>No Items found</p>
          </li>
        )}
        {[...displayCollection].map((item) => {
          return <SelectMenuOption item={item as Node<T>} key={item.key} />;
        })}
      </ul>
    </div>
  );
}

function SelectMenuOption<T extends object>(props: SelectMenuOptionProps<T>) {
  const { listBoxState } = useSelectState();
  const ref = React.useRef<HTMLLIElement>(null);
  const { optionProps, isSelected, isFocusVisible } = useOption(
    { key: props.item.key },
    listBoxState,
    ref
  );

  return (
    <li
      {...optionProps}
      ref={ref}
      className={clsx(
        "border outline-none",
        isFocusVisible && "border-sky-900",
        isSelected && "bg-sky-900 text-white"
      )}
    >
      {props.item?.rendered}
    </li>
  );
}

export function SelectRoot() {
  return (
    <div>
      <SelectTrigger className="flex justify-between">
        <div className="flex w-full">
          <SelectTriggerSelection />
          <SelectSearch />
        </div>
        <SelectTriggerClearSelection />
      </SelectTrigger>
      <SelectMenuOverlay>
        <SelectMenu />
      </SelectMenuOverlay>
    </div>
  );
}
