// shared/components/ui/DraggablePlayer.jsx
import React from 'react';
import { useDrag } from 'react-dnd';
import Avatar from '@shared/components/ui/Avatar';

const DraggablePlayer = ({ player }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'PLAYER',
    item: { player },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div 
      ref={drag} 
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#fff'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar src={player.avatar} size="sm" />
        <div style={{ marginLeft: '8px' }}>
          <div>{player.name}</div>
          <div>${player.stack}</div>
        </div>
      </div>
    </div>
  );
};

export default DraggablePlayer;