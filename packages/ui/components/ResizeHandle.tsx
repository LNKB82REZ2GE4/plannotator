import React from 'react';
import type { ResizeHandleProps as BaseProps } from '../hooks/useResizablePanel';

interface Props extends BaseProps {
  className?: string;
  /** Controls which direction the touch area extends to avoid covering adjacent scrollbars.
   *  'left' = handle is on the right edge of the left sidebar, touch area extends leftward.
   *  'right' = handle is on the left edge of the right panel, touch area extends rightward. */
  side?: 'left' | 'right';
}

export const ResizeHandle: React.FC<Props> = ({
  isDragging,
  onMouseDown,
  onTouchStart,
  onDoubleClick,
  className,
  side,
}) => (
  <div
    className={`relative w-0 cursor-col-resize flex-shrink-0 group z-10${className ? ` ${className}` : ''}`}
  >
    {/* Visible track — 4px wide, centered on the zero-width layout box */}
    <div className={`absolute inset-y-0 -left-0.5 -right-0.5 transition-colors ${
      isDragging ? 'bg-primary/50' : 'group-hover:bg-border'
    }`} />
    {/* Wider touch area — extends away from adjacent scrollbar */}
    <div
      className={`absolute inset-y-0 ${
        side === 'left' ? '-right-2 -left-1' :
        side === 'right' ? '-left-2 -right-1' :
        '-inset-x-2'
      }`}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onDoubleClick={onDoubleClick}
    />
  </div>
);
