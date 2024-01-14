import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Mail } from "lucide-react";

import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  component: Button,
  args: {
    loading: false,
    isDisabled: false,
    variant: "primary",
  },
};
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  render: ({ icon, ...props }) => <Button {...props}>Default</Button>,
};
export const Icon: Story = {
  render: ({ isDisabled }) => (
    <Button
      isDisabled={isDisabled}
      icon={<Mail className="w-4 h-4" />}
      variant="secondary"
    />
  ),
};
export const AsDiv: Story = {
  render: ({ isDisabled, loading }) => (
    <Button
      isDisabled={isDisabled}
      loading={loading}
      elementType={(props) => <span {...props} />}
    >
      Button as div
    </Button>
  ),
};

export default meta;
