import { PartialOptions } from 'overlayscrollbars';

export type ScrollbarOptions = PartialOptions;

export type ScrollbarHandler = (element: HTMLElement, overlay: OverlayScrollbars) => void;

export interface Scrollbar {
  handler: ScrollbarHandler;
  options: ScrollbarOptions;
}

export const DEFAULT_SCROLLBAR_OPTIONS: PartialOptions = {
  overflow: {
    x: 'scroll',
    y: 'scroll'
  },
  scrollbars: {
    autoHide: 'move'
  }
};
