import * as React from 'react';
import { Link } from 'react-router-dom';

import { ButtonProps } from './Button.types';
import { StyledButton, StyledButtonLoader, ButtonIcon } from './Button.styled';

const ButtonLoader = () => (
  <StyledButtonLoader>
    <div />
    <div />
    <div />
  </StyledButtonLoader>
);

const ButtonContent: React.FC<ButtonProps> = ({ children, icon, isLoading }) => (
  <>
    {isLoading ? (
      <ButtonLoader />
    ) : (
      <>
        {icon && (
          <ButtonIcon>
            {icon}
          </ButtonIcon>
        )}
        <span>{children}</span>
      </>
    )}
  </>
);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  children, href, icon, iconPosition = 'left', isLoading, onClick, to, urlTarget, disabled,
  ...otherProps
}, ref) => {
  const styledButtonProps = {
    disabled,
    iconOnly: !children && icon,
    iconPosition,
    isLoading,
    ref,
  };

  const buttonContentProps = {
    children,
    icon,
    isLoading,
  };

  if (href) {
    return (
      <StyledButton
        as="a"
        href={href}
        target={`_${urlTarget || 'self'}`}
        {...styledButtonProps}
        {...otherProps}
      >
        <ButtonContent {...buttonContentProps} />
      </StyledButton>
    );
  }

  if (to) {
    return (
      <StyledButton
        as={Link}
        to={to}
        {...styledButtonProps}
        {...otherProps}
      >
        <ButtonContent {...buttonContentProps} />
      </StyledButton>
    );
  }

  return (
    <StyledButton
      onClick={onClick}
      {...styledButtonProps}
      {...otherProps}
    >
      <ButtonContent {...buttonContentProps} />
    </StyledButton>
  );
});
