import React, { forwardRef, useRef, useImperativeHandle, useEffect } from 'react';
import { classNames, getDataAttrs, noUndefinedProps, emit } from '../shared/utils';
import { colorClasses } from '../shared/mixins';
import { f7ready, f7 } from '../shared/f7';
import { watchProp } from '../shared/watch-prop';

/* dts-props
  id?: string | number;
  className?: string;
  style?: React.CSSProperties;
  side? : string
  effect? : string
  cover? : boolean
  reveal? : boolean
  left? : boolean
  right? : boolean
  opened? : boolean
  resizable? : boolean
  backdrop? : boolean
  backdropEl? : string
  visibleBreakpoint? : number
  collapsedBreakpoint? : number
  swipe? : boolean
  swipeNoFollow? : boolean
  swipeOnlyClose? : boolean
  swipeActiveArea? : number
  swipeThreshold? : number
  COLOR_PROPS
  onPanelOpen? : (event?: any) => void
  onPanelOpened? : (event?: any) => void
  onPanelClose? : (event?: any) => void
  onPanelClosed? : (event?: any) => void
  onPanelBackdropClick? : (event?: any) => void
  onPanelSwipe? : (event?: any) => void
  onPanelSwipeOpen? : (event?: any) => void
  onPanelBreakpoint? : (event?: any) => void
  onPanelCollapsedBreakpoint? : (event?: any) => void
  onPanelResize? : (...args: any[]) => void
*/

const Panel = forwardRef((props, ref) => {
  const f7Panel = useRef(null);
  const {
    className,
    id,
    style,
    children,
    side,
    effect,
    // cover,
    reveal,
    left,
    // right,
    opened,
    resizable,
    backdrop = true,
    backdropEl,
    visibleBreakpoint,
    collapsedBreakpoint,
    swipe,
    swipeNoFollow,
    swipeOnlyClose,
    swipeActiveArea = 0,
    swipeThreshold = 0,
  } = props;

  const dataAttrs = getDataAttrs(props);

  const elRef = useRef(null);

  const onOpen = (event) => {
    emit(props, 'panelOpen', event);
  };
  const onOpened = (event) => {
    emit(props, 'panelOpened', event);
  };
  const onClose = (event) => {
    emit(props, 'panelClose', event);
  };
  const onClosed = (event) => {
    emit(props, 'panelClosed', event);
  };
  const onBackdropClick = (event) => {
    emit(props, 'click panelBackdropClick', event);
  };
  const onSwipe = (event) => {
    emit(props, 'panelSwipe', event);
  };
  const onSwipeOpen = (event) => {
    emit(props, 'panelSwipeOpen', event);
  };
  const onBreakpoint = (event) => {
    emit(props, 'panelBreakpoint', event);
  };
  const onCollapsedBreakpoint = (event) => {
    emit(props, 'panelCollapsedBreakpoint', event);
  };
  const onResize = (...args) => {
    emit(props, 'panelResize', ...args);
  };
  const open = (animate) => {
    if (!f7Panel.current) return;
    f7Panel.current.open(animate);
  };
  const close = (animate) => {
    if (!f7Panel.current) return;
    f7Panel.current.close(animate);
  };
  const toggle = (animate) => {
    if (!f7Panel.current) return;
    f7Panel.current.toggle(animate);
  };

  useImperativeHandle(ref, () => ({
    el: elRef.current,
    f7Panel: f7Panel.current,
    open,
    close,
    toggle,
  }));

  watchProp(resizable, (newValue) => {
    if (!f7Panel.current) return;
    if (newValue) f7Panel.current.enableResizable();
    else f7Panel.current.disableResizable();
  });
  watchProp(opened, (newValue) => {
    if (!f7Panel.current) return;
    if (newValue) {
      f7Panel.current.open();
    } else {
      f7Panel.current.close();
    }
  });

  const onMount = () => {
    f7ready(() => {
      const $ = f7.$;
      if (!$) return;
      if ($('.panel-backdrop').length === 0) {
        $('<div class="panel-backdrop"></div>').insertBefore(elRef.current);
      }
      const params = noUndefinedProps({
        el: elRef.current,
        resizable,
        backdrop,
        backdropEl,
        visibleBreakpoint,
        collapsedBreakpoint,
        swipe,
        swipeNoFollow,
        swipeOnlyClose,
        swipeActiveArea,
        swipeThreshold,
        on: {
          open: onOpen,
          opened: onOpened,
          close: onClose,
          closed: onClosed,
          backdropClick: onBackdropClick,
          swipe: onSwipe,
          swipeOpen: onSwipeOpen,
          collapsedBreakpoint: onCollapsedBreakpoint,
          breakpoint: onBreakpoint,
          resize: onResize,
        },
      });
      f7Panel.current = f7.panel.create(params);
      if (opened) {
        f7Panel.current.open(false);
      }
    });
  };

  const onDestroy = () => {
    if (f7Panel.current && f7Panel.current.destroy) {
      f7Panel.current.destroy();
    }
  };

  useEffect(() => {
    onMount();
    return onDestroy;
  });

  const sideComputed = side || (left ? 'left' : 'right');
  const effectComputed = effect || (reveal ? 'reveal' : 'cover');
  const classes = classNames(
    className,
    'panel',
    {
      'panel-resizable': resizable,
      [`panel-${sideComputed}`]: sideComputed,
      [`panel-${effectComputed}`]: effectComputed,
    },
    colorClasses(props),
  );

  return (
    <div id={id} style={style} className={classes} ref={elRef} {...dataAttrs}>
      {children}
      {resizable && <div className="panel-resize-handler"></div>}
    </div>
  );
});

Panel.displayName = 'f7-panel';

export default Panel;