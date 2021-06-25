import { DraggableProvided } from 'react-beautiful-dnd';

const grid = 8;

export function getCombinedStyle({
  provided,
  style,
  isDragging,
}: {
  provided: DraggableProvided;
  style: React.CSSProperties;
  isDragging: boolean;
}): React.CSSProperties {
  // If you don't want any spacing between your items
  // then you could just return this.
  // I do a little bit of magic to have some nice visual space
  // between the row items
  const combined: React.CSSProperties = {
    ...style,
    ...provided.draggableProps.style,
  };

  const withSpacing = {
    ...combined,
    padding: '5px 10px',
    left: grid,
    height: isDragging ? combined.height : (combined.height as number) - grid,
    width: isDragging
      ? combined.width
      : `calc(${combined.width} - ${grid * 2}px)`,
    // border: '3px solid black',
    boxShadow: '1px 1px 3px 1px rgba(0, 0, 0, 0.1)',
    marginBottom: `${grid}px`,
    borderRadius: 2,
  };
  return withSpacing;
}
