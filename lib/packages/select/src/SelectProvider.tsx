import * as React from "react";
import { AriaListBoxProps, ListBoxAria, useListBox } from "@react-aria/listbox";
import { ListState, useListState } from "@react-stately/list";
import {
  SearchFieldState,
  useSearchFieldState,
} from "@react-stately/searchfield";
import { useFilter } from "@react-aria/i18n";
import {
  OverlayTriggerState,
  useOverlayTriggerState,
} from "@react-stately/overlays";
import { Collection, Node } from "@react-types/shared";

import { SelectRoot } from "./SelectRoot";
import { filterCollection } from "./utils";
import {
  OverlayTriggerAria,
  PopoverAria,
  useOverlayTrigger,
  usePopover,
} from "@react-aria/overlays";
import { SearchFieldAria, useSearchField } from "@react-aria/searchfield";

type SelectContextValue<T extends object> = {
  state: {
    listBoxState: ListState<T> & {
      filteredCollection?: Collection<Node<T>>;
    };
    overlayTriggerState: OverlayTriggerState;
    searchState: SearchFieldState;
  };
  props: {
    listBoxProps: AriaListBoxProps<T>;
    triggerProps: OverlayTriggerAria;
    popoverProps: PopoverAria;
    searchProps: SearchFieldAria;
  };
  refs: {
    listBoxRef: React.RefObject<HTMLUListElement>;
    triggerRef: React.RefObject<HTMLDivElement>;
    popoverRef: React.RefObject<HTMLDivElement>;
    searchRef: React.RefObject<HTMLInputElement>;
  };
};
interface SelectProps<T> extends AriaListBoxProps<T> {
  inputPlaceholder?: string;
  defaultMenuOpen?: boolean;
}

const SelectContext = React.createContext<SelectContextValue<any> | null>(null);

export function useSelectState() {
  const context = React.useContext(SelectContext);

  if (!context) {
    throw new Error(
      "useSelectState() should be used inside <SelectProvider />."
    );
  }

  return context.state;
}

export function useSelectProps() {
  const context = React.useContext(SelectContext);

  if (!context) {
    throw new Error(
      "useSelectProps() should be used inside <SelectProvider />."
    );
  }

  return context.props;
}

export function useSelectRefs() {
  const context = React.useContext(SelectContext);

  if (!context) {
    throw new Error(
      "useSelectRefs() should be used inside <SelectProvider />."
    );
  }

  return context.refs;
}

export function Select<T extends object>({
  inputPlaceholder,
  defaultMenuOpen = false,
  ...props
}: SelectProps<T>) {
  // Refs definition
  const listBoxRef = React.useRef<HTMLUListElement>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);

  // State definition
  const [filteredCollection, setFilteredCollection] =
    React.useState<Collection<Node<T>>>();
  const { contains } = useFilter({ sensitivity: "base" });
  const listBoxState = useListState(props);
  const searchState = useSearchFieldState({
    label: "rui-select-search-input",
    placeholder: inputPlaceholder ?? "Search",
    onChange: (newValue) => {
      setFilteredCollection(
        filterCollection(listBoxState.collection, newValue, contains)
      );
    },
  });
  const overlayTriggerState = useOverlayTriggerState({
    defaultOpen: defaultMenuOpen,
    onOpenChange: (isOpen) => {
      if (isOpen) {
        searchRef.current?.focus();
      } else {
        searchState.setValue("");
        searchRef.current?.blur();
      }
    },
  });

  // Props definition
  const triggerProps = useOverlayTrigger(
    { type: "listbox" },
    overlayTriggerState,
    triggerRef
  );
  const popoverProps = usePopover(
    {
      popoverRef,
      triggerRef,
      placement: "bottom left",
      offset: 5,
    },
    overlayTriggerState
  );
  const searchProps = useSearchField(
    {
      "aria-label": "rui-select-search",
      placeholder: inputPlaceholder ?? "Select",
      onBlur: () => {
        overlayTriggerState.close();
      },
      onKeyDown: (e) => {
        if (e.code === "Backspace") {
          const lastSelectedKey = [
            ...listBoxState.selectionManager.selectedKeys.keys(),
          ][listBoxState.selectionManager.selectedKeys.size - 1];

          if (listBoxState.selectionManager.isSelected(lastSelectedKey)) {
            listBoxState.selectionManager.toggleSelection(lastSelectedKey);
          }
        }
      },
    },
    searchState,
    searchRef
  );

  // Context value
  const value: SelectContextValue<T> = {
    state: {
      listBoxState: { ...listBoxState, filteredCollection },
      overlayTriggerState,
      searchState,
    },
    props: {
      listBoxProps: props,
      triggerProps,
      popoverProps,
      searchProps,
    },
    refs: {
      listBoxRef,
      popoverRef,
      searchRef,
      triggerRef,
    },
  };

  return (
    <SelectContext.Provider value={value}>
      <SelectRoot />
    </SelectContext.Provider>
  );
}
