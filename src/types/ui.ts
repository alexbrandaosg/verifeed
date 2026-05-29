
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LogoProps extends ComponentProps {
  size?: 'small' | 'medium' | 'large';
}

export interface HeaderProps extends ComponentProps {
  title?: string;
  showLogo?: boolean;
  actions?: React.ReactNode;
}
