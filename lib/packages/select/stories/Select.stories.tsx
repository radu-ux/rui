import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Item } from "@react-stately/collections";

import { Select } from "../src/SelectProvider";

type Story = StoryObj<typeof Select>;

const meta: Meta<typeof Select> = {
  component: Select,
};

export const Default: Story = {
  render: () => (
    <Select selectionMode="multiple">
      <Item key="item-1" textValue="Item 1">
        Item 1
      </Item>
      <Item key="item-2" textValue="Item 2">
        Item 2
      </Item>
      <Item key="item-3" textValue="Item 3">
        Item 3
      </Item>
    </Select>
  ),
};

export default meta;
