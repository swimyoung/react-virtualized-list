class ShadowListItem {
  constructor(
    public height: number,
    public offset: number,
    public index: number,
  ) {
    // TODO: ts shorthand property declaration doesn't work on storybook
    this.height = height;
    this.offset = offset;
    this.index = index;
  }
}

class ShadowList {
  items: ShadowListItem[];
  itemHeight: number;
  height: number;
  visibleItems: ShadowListItem[] = [];
  viewportHeight: number;
  viewportPadding: number;

  constructor(params: {
    itemCount: number;
    itemHeight: number;
    viewportHeight: number;
    viewportPadding?: number;
  }) {
    this.itemHeight = params.itemHeight;
    this.items = Array.from({ length: params.itemCount }).map(
      (_, index) => new ShadowListItem(this.itemHeight, 0, index),
    );
    this.viewportHeight = params.viewportHeight;
    this.viewportPadding = params.viewportPadding || 0;
    this.calculateItemOffset();
    this.calculateHeight();
    this.moveViewportOffsetTop(0);
  }

  setItemCount(itemCount: number): void {
    if (itemCount === this.items.length) {
      return;
    }

    if (itemCount > this.items.length) {
      const lastIndex = this.items.length - 1;
      Array.from({ length: itemCount - this.items.length }).reduce(
        (previousItem: ShadowListItem) => {
          const item = new ShadowListItem(
            this.itemHeight,
            previousItem.offset + this.itemHeight,
            previousItem.index + 1,
          );
          this.items.push(item);
          return item;
        },
        this.items[this.items.length - 1],
      );
      this.calculateItemOffset(lastIndex);
    } else {
      this.items.length = itemCount;
    }

    this.calculateHeight();
    this.moveViewportOffsetTop(this.visibleItems[0].offset);
  }

  // TODO: Test Case
  setItemHeight(height: number): void {
    this.itemHeight = height;
    this.items[0].height = this.itemHeight;
    this.items.reduce(
      (previousItem: ShadowListItem, currentItem: ShadowListItem) => {
        currentItem.height = this.itemHeight;
        currentItem.offset = previousItem.offset + previousItem.height;
        return currentItem;
      },
    );
    this.calculateHeight();
    this.moveViewportOffsetTop(this.visibleItems[0].offset);
  }

  setViewportHeight(height: number): void {
    this.viewportHeight = height;
    this.moveViewportOffsetTop(this.visibleItems[0].offset);
  }

  setViewportPadding(padding: number): void {
    this.viewportPadding = padding;
    this.moveViewportOffsetTop(this.visibleItems[0].offset);
  }

  moveViewportOffsetTop(offset: number): void {
    if (this.items.length === 0) {
      return;
    }

    if (offset < 0) {
      offset = 0;
    } else if (offset > this.height) {
      offset = this.height;
    }

    const startIndex = this.searchIndex(offset - this.viewportPadding);
    const endIndex = this.searchIndex(
      offset + this.viewportHeight + this.viewportPadding,
    );

    this.visibleItems = [];
    for (let index = startIndex; index <= endIndex; index++) {
      this.visibleItems.push({ ...this.items[index] });
    }
  }

  private searchIndex(offset: number): number {
    if (offset < 0) {
      offset = 0;
    } else if (offset > this.height) {
      offset = this.height;
    }

    let left = 0;
    let right = this.items.length;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const item = this.items[mid];

      if (
        left === right &&
        !(offset >= item.offset && offset <= item.offset + item.height)
      ) {
        break;
      }

      if (offset < item.offset) {
        right = mid;
      } else if (offset > item.offset + item.height) {
        left = mid;
      } else {
        return mid;
      }
    }

    return -1;
  }

  private calculateItemOffset(startIndex = 0): void {
    for (let i = startIndex + 1; i < this.items.length; i++) {
      const previousItem = this.items[i - 1];
      this.items[i].offset = previousItem.offset + previousItem.height;
    }
  }

  private calculateHeight(): void {
    this.height = this.items.reduce((height, item) => {
      return height + item.height;
    }, 0);
  }
}

export { ShadowList, ShadowListItem };
