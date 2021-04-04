import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
  createElement,
} from 'react';
import { ShadowList, ShadowListItem } from './ShadowList';
import { VirtualizedListItem } from './VirtualizedListItem';

function getScrollTop(element: HTMLElement | Document): number {
  return element === document
    ? (element.scrollingElement || element.documentElement).scrollTop
    : (element as HTMLElement).scrollTop;
}

function getScrollContainer(element: HTMLElement): HTMLElement | Document {
  if (!element || element.tagName === 'BODY') {
    return document;
  }

  const { overflow, overflowY } = window.getComputedStyle(element);
  if (/(auto|scroll)/.test(overflow + overflowY)) {
    return element;
  } else {
    return getScrollContainer(element.parentElement);
  }
}

interface RenderFunction {
  (item: ShadowListItem): any;
}

type VirtualizedListProps = {
  height: number | 'auto';
  itemCount: number;
  onRenderItem: RenderFunction;
  itemHeight?: number;
  viewportPadding?: number;
};

type ScrollState = {
  scrollTop: number;
  scrolling: boolean;
  scrollDirection: 'top' | 'bottom' | null;
};

function VirtualizedList(props: VirtualizedListProps) {
  const {
    height,
    itemCount,
    itemHeight,
    viewportPadding,
    onRenderItem,
  } = props;
  const [, updateState] = useState<number>();
  const forceUpdate = useCallback(
    () => updateState((state) => (state === 0 ? 1 : 0)),
    [],
  );
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollTop: 0,
    scrolling: false,
    scrollDirection: null,
  });
  const shadowList = useMemo(() => {
    return new ShadowList({
      itemCount,
      itemHeight,
      viewportHeight: 0,
      viewportPadding,
    });
  }, []);
  const containerElement = useRef<HTMLDivElement>(null);
  const containerElementRectY = useRef(0);
  const scrollElement = useRef<HTMLElement | Document>(null);
  const scrollEndTimeoutId = useRef<number>(null);

  useEffect(() => {
    shadowList.setItemCount(itemCount);
    forceUpdate();
  }, [itemCount]);
  useEffect(() => {
    if (!itemHeight) {
      return;
    }
    shadowList.setItemHeight(itemHeight);
    forceUpdate();
  }, [itemHeight]);
  useEffect(() => {
    shadowList.setViewportPadding(viewportPadding);
    forceUpdate();
  }, [viewportPadding]);
  useEffect(() => {
    if (height === 'auto') {
      const element = getScrollContainer(scrollElement.current as HTMLElement);
      if (element !== scrollElement.current) {
        scrollElement.current = element;
      }
      containerElementRectY.current =
        getScrollTop(scrollElement.current) +
        containerElement.current.getBoundingClientRect().y;

      shadowList.setViewportHeight(
        scrollElement.current === document
          ? document.documentElement.clientHeight
          : (scrollElement.current as HTMLElement).clientHeight,
      );
    } else {
      scrollElement.current = containerElement.current;
      shadowList.setViewportHeight(height);
    }

    forceUpdate();
    scrollElement.current.addEventListener('scroll', handleScroll);
    return () => {
      scrollElement.current?.removeEventListener('scroll', handleScroll);
    };
  }, [height]);

  function handleScroll() {
    const { scrollTop: previousScrollTop } = scrollState;
    const currentScrollTop = getScrollTop(scrollElement.current);
    if (currentScrollTop === previousScrollTop) {
      return;
    }

    setScrollState({
      scrollTop: currentScrollTop,
      scrolling: true,
      scrollDirection: currentScrollTop >= previousScrollTop ? 'top' : 'bottom',
    });

    window.clearTimeout(scrollEndTimeoutId.current);
    scrollEndTimeoutId.current = window.setTimeout(handleScrollEnd, 150);
  }

  function handleScrollEnd() {
    setScrollState({
      scrollTop: getScrollTop(scrollElement.current),
      scrolling: false,
      scrollDirection: null,
    });
  }

  function renderItems() {
    const { scrollTop } = scrollState;
    shadowList.moveViewportOffsetTop(scrollTop - containerElementRectY.current);

    return shadowList.visibleItems.map((shadowListItem) =>
      createElement(VirtualizedListItem, { shadowListItem, onRenderItem }),
    );
  }

  // TODO: outer/inner element styling
  return createElement(
    'div',
    {
      ref: containerElement,
      style: {
        width: 'auto',
        height: height,
        overflowX: 'hidden',
        overflowY: 'auto',
        position: 'relative',
      },
    },
    createElement(
      'div',
      {
        style: {
          width: 'auto',
          height: shadowList.height,
          maxHeight: shadowList.height,
          overflow: 'hidden',
          position: 'relative',
        },
      },
      renderItems(),
    ),
  );
}

export { VirtualizedList, RenderFunction };
