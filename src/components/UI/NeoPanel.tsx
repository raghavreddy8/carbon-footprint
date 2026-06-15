import React from 'react';

/**
 * @file NeoPanel.tsx
 * @description A reusable card/panel component designed with a bold neo-brutalist aesthetic,
 * featuring a title bar with window controls styling and customizable backgrounds and borders.
 */

interface NeoPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  backgroundColor?: string;
  borderColor?: string;
  shadowColor?: string;
  title?: string;
  headerBg?: string;
}

export const NeoPanel: React.FC<NeoPanelProps> = ({
  children,
  backgroundColor = '#FFFFFF',
  borderColor = '#111827',
  shadowColor = '#111827',
  title,
  headerBg = '#F3F4F6',
  className = '',
  style,
  ...props
}) => {
  const panelStyle: React.CSSProperties = {
    backgroundColor,
    border: `4px solid ${borderColor}`,
    boxShadow: `6px 6px 0px ${shadowColor}`,
    borderRadius: '4px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'inherit',
    ...style
  };

  return (
    <div className={`neo-panel ${className}`} style={panelStyle} {...props}>
      {title && (
        <div
          style={{
            borderBottom: `4px solid ${borderColor}`,
            backgroundColor: headerBg,
            padding: '10px 16px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            fontSize: '14px',
            letterSpacing: '1px',
            color: '#111827',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span>{title}</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#EF4444', border: '2px solid #111827' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F59E0B', border: '2px solid #111827' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981', border: '2px solid #111827' }} />
          </div>
        </div>
      )}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
};
