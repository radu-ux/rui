/**
 * Implementation Details
 *
 * COMPONENT STATE: listBoxState, searchState, overlayState
 *
 * INTERNAL ANATOMY:
 * <SelectProvider>
 *    <SelectRoot>
 *        <SelectSearch />
 *        <SelectPopover>
 *           <SelectMenu>
 *              <SelectMenuOption />
 *               <SelectMenuOption />
 *               <SelectMenuOption />
 *           </SelectMenu>
 *        </SelectPopover>
 *    </SelectRoot>
 * </SelectProvider>
 *
 * NOTES:
 * SelectContext: provides state and props to be used down the tree
 */

import React from "react";
import { Collection, Node } from "@react-types/shared";
import { ListState, useListState, ListCollection } from "@react-stately/list";
import { useOverlayTriggerState } from "@react-stately/overlays";
import { getChildNodes } from "@react-stately/collections";
import { useSearchFieldState } from "@react-stately/searchfield";
import { useFilter } from "@react-aria/i18n";
import { useListBox, AriaListBoxProps, useOption } from "@react-aria/listbox";
import { Overlay, useOverlayTrigger, usePopover } from "@react-aria/overlays";
import { AriaButtonProps, useButton } from "@react-aria/button";
import { useSearchField } from "@react-aria/searchfield";

import { clsx } from "rui-component-utils";

interface ListBoxProps<T> extends AriaListBoxProps<T> {
  state: ListState<T>;
}
interface OptionProps<T> {
  state: ListState<T>;
  item: any;
}
interface TriggerProps<T extends React.ElementType> extends AriaButtonProps<T> {
  buttonRef?: React.RefObject<Element>;
  className?: string;
}
type FilterFn = (textValue: string, inputValue: string) => boolean;

function filterCollection<T extends object>(
  collection: Collection<Node<T>>,
  inputValue: string,
  filter: FilterFn
): Collection<Node<T>> {
  return new ListCollection(
    filterNodes(collection, collection, inputValue, filter)
  );
}

function filterNodes<T>(
  collection: Collection<Node<T>>,
  nodes: Iterable<Node<T>>,
  inputValue: string,
  filter: FilterFn
): Iterable<Node<T>> {
  let filteredNode: Node<T>[] = [];
  for (let node of nodes) {
    if (node.type === "section" && node.hasChildNodes) {
      let filtered = filterNodes(
        collection,
        getChildNodes(node, collection),
        inputValue,
        filter
      );
      if ([...filtered].some((node) => node.type === "item")) {
        filteredNode.push({ ...node, childNodes: filtered });
      }
    } else if (node.type === "item" && filter(node.textValue, inputValue)) {
      filteredNode.push({ ...node });
    } else if (node.type !== "item") {
      filteredNode.push({ ...node });
    }
  }
  return filteredNode;
}

function Trigger<T extends React.ElementType>(props: TriggerProps<T>) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const { buttonRef = ref, ...rest } = props;
  const { buttonProps } = useButton(rest, buttonRef);
  const Comp = props.elementType ?? "button";

  return (
    <Comp
      {...buttonProps}
      ref={buttonRef as any}
      className={clsx(
        "outline-none border focus-visible:border-blue-600",
        props.className
      )}
    >
      {props.children}
    </Comp>
  );
}

function ListBox<T extends object>({ state, ...props }: ListBoxProps<T>) {
  const [inputValue, setInputValue] = React.useState<string>("");
  const [filteredCollection, setFilteredCollection] =
    React.useState<Collection<Node<T>>>();
  const listboxRef = React.useRef<React.ElementRef<"ul">>(null);
  const inputRef = React.useRef<React.ElementRef<"input">>(null);

  const { contains } = useFilter({ sensitivity: "base" });
  const searchFieldState = useSearchFieldState({
    label: "search-select",
    placeholder: "Search",
    value: inputValue,
    onChange: (newValue) => {
      setFilteredCollection(
        filterCollection(state.collection, newValue, contains)
      );
      setInputValue(newValue);
    },
  });

  const { inputProps } = useSearchField(
    { label: "search-select", placeholder: "Search" },
    searchFieldState,
    inputRef
  );
  const { listBoxProps } = useListBox(
    {
      ...props,
      selectionMode: props.selectionMode === "none" ? "single" : "multiple",
      "aria-label": "my-list",
    },
    state,
    listboxRef
  );

  const displayedCollection = filteredCollection ?? state.collection;

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <input
        {...inputProps}
        ref={inputRef}
        className="outline-none border focus-visible:border-slate-600"
      />
      <ul {...listBoxProps} ref={listboxRef} className="max-h-[200px]">
        {displayedCollection.size === 0 && (
          <li className="flex items-center justify-center h-full border">
            <p>No Items found</p>
          </li>
        )}
        {[...displayedCollection].map((item) => {
          return <Option item={item} key={item.key} state={state} />;
        })}
      </ul>
    </div>
  );
}

function Option<T extends object>({ state, item }: OptionProps<T>) {
  const ref = React.useRef<HTMLLIElement>(null);
  const { optionProps, isSelected, isFocusVisible } = useOption(
    { key: item.key },
    state,
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
      {item.rendered}
    </li>
  );
}

function SelectedItem<T extends object>({
  item,
  onRemove,
}: {
  item: Node<T>;
  onRemove: (item: Node<T>) => void;
}) {
  return (
    <div className="border flex gap-1">
      <p className="border-r">{item.textValue}</p>
      <Trigger
        onPress={() => onRemove(item)}
        className="hover:bg-black hover:text-white"
        data-id="remove-option"
      >
        x
      </Trigger>
    </div>
  );
}

export function Select<T extends object>(props: AriaListBoxProps<T>) {
  const [listBoxWidth, setListboxWidth] = React.useState(0);
  const triggerRef = React.useRef<React.ElementRef<"div">>(null);
  const popoverRef = React.useRef<React.ElementRef<"div">>(null);

  const listState = useListState(props);
  const overlayState = useOverlayTriggerState({ defaultOpen: false });

  const { popoverProps } = usePopover(
    {
      shouldCloseOnInteractOutside: (element) => {
        if (element.getAttribute("data-id") === "remove-option") return false;

        return true;
      },
      popoverRef,
      triggerRef,
      placement: "bottom start",
      offset: 10,
    },
    overlayState
  );
  const { triggerProps, overlayProps } = useOverlayTrigger(
    { type: "listbox" },
    overlayState
  );

  const selectedItems = [...listState.selectionManager.selectedKeys.keys()].map(
    (key) => listState.collection.getItem(key)
  );

  const onRemoveFromSelection = (item: Node<T>) => {
    const filteredKeys = [
      ...listState.selectionManager.selectedKeys.keys(),
    ].filter((key) => item.key !== key);
    listState.selectionManager.setSelectedKeys(filteredKeys);
  };

  const onClearSelection = () => {
    listState.selectionManager.setSelectedKeys([]);
  };

  React.useEffect(() => {
    let onResize = () => {
      if (triggerRef.current) {
        setListboxWidth(triggerRef.current?.offsetWidth);
      }
    };

    onResize();

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div>
      <Trigger
        {...triggerProps}
        onPress={(e) => {
          console.log("pressing");
          triggerProps.onPress?.(e);
        }}
        buttonRef={triggerRef}
        elementType="div"
        className="flex justify-between border-red-950"
      >
        <div className="flex border border-blue-600">
          {selectedItems.length > 0 &&
            selectedItems.map((item) => (
              <SelectedItem
                item={item!}
                key={`selected-item-${item!.key}`}
                onRemove={onRemoveFromSelection}
              />
            ))}
          {selectedItems.length === 0 && "Select an item"}
        </div>
        <div>
          <Trigger onPress={onClearSelection} data-id="remove-option">
            x
          </Trigger>
        </div>
      </Trigger>
      {overlayState.isOpen && (
        <Overlay {...overlayProps}>
          <div
            {...popoverProps}
            ref={popoverRef}
            className="shadow-md"
            style={{ ...popoverProps.style, width: listBoxWidth }}
          >
            <ListBox state={listState} {...props} />
          </div>
        </Overlay>
      )}
    </div>
  );
}
