import { ListCollection } from "@react-stately/list";
import { getChildNodes } from "@react-stately/collections";
import { Collection, Node } from "@react-types/shared";

type FilterFn = (textValue: string, inputValue: string) => boolean;

export function filterCollection<T extends object>(
  collection: Collection<Node<T>>,
  inputValue: string,
  filter: FilterFn
): Collection<Node<T>> {
  return new ListCollection(
    filterNodes(collection, collection, inputValue, filter)
  );
}

export function filterNodes<T>(
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
