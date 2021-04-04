import { ShadowList } from './ShadowList';

test('create instance', () => {
  const list = new ShadowList({
    itemCount: 5,
    itemHeight: 50,
    viewportHeight: 100,
  });
  expect(list.height).toBe(250);
  expect(list.items).toEqual([
    {
      index: 0,
      offset: 0,
      height: 50,
    },
    {
      index: 1,
      offset: 50,
      height: 50,
    },
    {
      index: 2,
      offset: 100,
      height: 50,
    },
    {
      index: 3,
      offset: 150,
      height: 50,
    },
    {
      index: 4,
      offset: 200,
      height: 50,
    },
  ]);
  expect(list.visibleItems).toEqual([
    {
      index: 0,
      offset: 0,
      height: 50,
    },
    {
      index: 1,
      offset: 50,
      height: 50,
    },
    {
      index: 2,
      offset: 100,
      height: 50,
    },
  ]);
});

test('create instance with item count 0', () => {
  const list = new ShadowList({
    itemCount: 0,
    itemHeight: 50,
    viewportHeight: 100,
  });
  expect(list.height).toBe(0);
  expect(list.items).toEqual([]);
  expect(list.visibleItems.length).toBe(0);
});

test('create instance with viewport padding', () => {
  const list = new ShadowList({
    itemCount: 20,
    itemHeight: 50,
    viewportHeight: 100,
    viewportPadding: 50,
  });

  expect(list.visibleItems.length).toBe(3);
  expect(list.visibleItems[0].offset).toBe(0);
  expect(list.visibleItems[list.visibleItems.length - 1].offset).toBe(100);
});

test('move viewport offset', () => {
  const list = new ShadowList({
    itemCount: 20,
    itemHeight: 50,
    viewportHeight: 100,
  });

  list.moveViewportOffsetTop(50);
  expect(list.visibleItems.length).toBe(2);
  expect(list.visibleItems[0].offset).toBe(50);
  expect(list.visibleItems[list.visibleItems.length - 1].offset).toBe(100);

  list.moveViewportOffsetTop(-50);
  expect(list.visibleItems.length).toBe(3);
  expect(list.visibleItems[0].offset).toBe(0);
  expect(list.visibleItems[list.visibleItems.length - 1].offset).toBe(100);
});

test('move viewport offset with viewport padding', () => {
  const list = new ShadowList({
    itemCount: 20,
    itemHeight: 50,
    viewportHeight: 100,
    viewportPadding: 50,
  });

  list.moveViewportOffsetTop(50);
  expect(list.visibleItems.length).toBe(4);
  expect(list.visibleItems[0].offset).toBe(0);
  expect(list.visibleItems[list.visibleItems.length - 1].offset).toBe(150);

  list.moveViewportOffsetTop(-50);
  expect(list.visibleItems.length).toBe(3);
  expect(list.visibleItems[0].offset).toBe(0);
  expect(list.visibleItems[list.visibleItems.length - 1].offset).toBe(100);
});

test('move viewport offset when viewport height is greater than total height', () => {
  const list = new ShadowList({
    itemCount: 10,
    itemHeight: 50,
    viewportHeight: 1000,
  });
  expect(list.visibleItems.length).toBe(10);
  expect(list.visibleItems[0].offset).toBe(0);
  expect(list.visibleItems[list.visibleItems.length - 1].offset).toBe(450);

  list.moveViewportOffsetTop(-50);
  expect(list.visibleItems.length).toBe(10);
  expect(list.visibleItems[0].offset).toBe(0);
  expect(list.visibleItems[list.visibleItems.length - 1].offset).toBe(450);
});

test('change item count', () => {
  const list = new ShadowList({
    itemCount: 10,
    itemHeight: 20,
    viewportHeight: 100,
  });
  expect(list.visibleItems.length).toBe(6);
  expect(list.visibleItems[0].offset).toBe(0);
  expect(list.visibleItems[list.visibleItems.length - 1].offset).toBe(100);

  list.setItemCount(5);
  expect(list.visibleItems.length).toBe(5);
  expect(list.visibleItems[0].offset).toBe(0);
  expect(list.visibleItems[list.visibleItems.length - 1].offset).toBe(80);

  list.setItemCount(10);
  expect(list.visibleItems.length).toBe(6);
  expect(list.visibleItems[0].offset).toBe(0);
  expect(list.visibleItems[list.visibleItems.length - 1].offset).toBe(100);
});

test('change viewport height', () => {
  const list = new ShadowList({
    itemCount: 10,
    itemHeight: 20,
    viewportHeight: 100,
  });
  expect(list.visibleItems.length).toBe(6);
  expect(list.visibleItems[0].offset).toBe(0);
  expect(list.visibleItems[list.visibleItems.length - 1].offset).toBe(100);

  list.setViewportHeight(150);
  expect(list.visibleItems.length).toBe(8);
  expect(list.visibleItems[0].offset).toBe(0);
  expect(list.visibleItems[list.visibleItems.length - 1].offset).toBe(140);

  list.setViewportHeight(100);
  expect(list.visibleItems.length).toBe(6);
  expect(list.visibleItems[0].offset).toBe(0);
  expect(list.visibleItems[list.visibleItems.length - 1].offset).toBe(100);
});

test('change viewport padding', () => {
  const list = new ShadowList({
    itemCount: 10,
    itemHeight: 20,
    viewportHeight: 100,
    viewportPadding: 20,
  });
  expect(list.visibleItems.length).toBe(6);
  expect(list.visibleItems[0].offset).toBe(0);
  expect(list.visibleItems[list.visibleItems.length - 1].offset).toBe(100);

  list.setViewportPadding(40);
  expect(list.visibleItems.length).toBe(8);
  expect(list.visibleItems[0].offset).toBe(0);
  expect(list.visibleItems[list.visibleItems.length - 1].offset).toBe(140);

  list.setViewportPadding(20);
  expect(list.visibleItems.length).toBe(6);
  expect(list.visibleItems[0].offset).toBe(0);
  expect(list.visibleItems[list.visibleItems.length - 1].offset).toBe(100);
});
