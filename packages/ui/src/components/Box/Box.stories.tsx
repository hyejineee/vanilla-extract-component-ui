import type { Meta, StoryObj } from '@storybook/react';
import { Box } from './Box';

const meta: Meta<typeof Box> = {
  title: 'Layout/Box',
  component: Box,
  tags: ['autodocs'],
};

type Story = StoryObj<typeof Box>;

export const Primary: Story = {
  args: {
    bgColor: 'bg.primary.default',
    color: 'blue.100',
    children: 'BOX',
    flexCenter: true,
  },

  render: (args) => {
    return <Box {...args}>ddd</Box>;
  },
};

export default meta;
