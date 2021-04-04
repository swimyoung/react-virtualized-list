import React, { useMemo } from 'react';
import { Meta } from '@storybook/react';
import { VirtualizedList } from './VirtualizedList';

const generateRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
};

export default {
  title: 'VirtualizedList',
  component: VirtualizedList,
} as Meta;

export const FixedItemHeight = (args: any): React.ReactNode => {
  const { itemCount, ...rest } = args;
  const data = useMemo(
    () => Array.from({ length: itemCount }).map(generateRandomColor),
    [itemCount],
  );

  return (
    <VirtualizedList
      {...rest}
      itemCount={data.length}
      onRenderItem={(item) => {
        return (
          <div
            style={{
              boxSizing: 'border-box',
              height: '100%',
              fontSize: '30px',
              color: data[item.index],
              lineHeight: `${item.height}px`,
              textAlign: 'center',
              borderBottom: '1px solid #eeeeee',
            }}
          >
            Index: <b>{item.index + 1}</b>
          </div>
        );
      }}
    />
  );
};
FixedItemHeight.args = {
  height: 500,
  itemHeight: 50,
  itemCount: 50 * 1000,
  viewportPadding: 100,
};
