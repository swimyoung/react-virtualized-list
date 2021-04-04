import { createElement } from 'react';
import { ShadowListItem } from './ShadowList';
import { RenderFunction } from './VirtualizedList';

type VirtualizedListItemProps = {
  shadowListItem: ShadowListItem;
  onRenderItem: RenderFunction;
};

function VirtualizedListItem(props: VirtualizedListItemProps) {
  const { shadowListItem, onRenderItem } = props;

  return createElement(
    'div',
    {
      key: `${shadowListItem.index}/${shadowListItem.offset}`,
      style: {
        position: 'absolute',
        transform: `translate(0, ${shadowListItem.offset}px)`,
        width: '100%',
        height: shadowListItem.height,
      },
    },
    onRenderItem(shadowListItem),
  );
}

export { VirtualizedListItem };
