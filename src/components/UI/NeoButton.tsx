import React from 'react';

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  shadowColor?: string;
}

export const NeoButton: React.FC<NeoButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  shadowColor = '#111827',
  className = '',
  style,
  ...props
}) => {
  const getColors = () => {
    switch (variant) {
      case 'secondary':
        return { bg: '#F3F4F6', text: '#111827' };
      case 'danger':
        return { bg: '#EF4444', text: '#FFFFFF' };
      case 'success':
        return { bg: '#10B981', text: '#FFFFFF' };
      case 'primary':
      default:
        return { bg: '#F59E0B', text: '#111827' };
    }
  };

  const colors = getColors();

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'inherit',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    cursor: 'pointer',
    border: '3px solid #111827',
    borderRadius: '4px',
    backgroundColor: colors.bg,
    color: colors.text,
    boxShadow: `3px 3px 0px ${shadowColor}`,
    transition: 'transform 0.1s ease, box-shadow 0.1s ease',
    outline: 'none',
    ...style
  };

  const getPadding = () => {
    switch (size) {
      case 'sm':
        return { padding: '6px 12px', fontSize: '12px' };
      case 'lg':
        return { padding: '14px 28px', fontSize: '18px' };
      case 'md':
      default:
        return { padding: '10px 20px', fontSize: '14px' };
    }
  };

  const paddingStyle = getPadding();

  // Combine styles
  const combinedStyle = { ...baseStyle, ...paddingStyle };

  return (
    <button
      className={`neo-button ${className}`}
      style={combinedStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translate(-2px, -2px)';
        e.currentTarget.style.boxShadow = `5px 5px 0px ${shadowColor}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = `3px 3px 0px ${shadowColor}`;
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translate(1px, 1px)';
        e.currentTarget.style.boxShadow = `1px 1px 0px ${shadowColor}`;
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translate(-2px, -2px)';
        e.currentTarget.style.boxShadow = `5px 5px 0px ${shadowColor}`;
      }}
      {...props}
    >
      {children}
    </button>
  );
};
