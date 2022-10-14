import { forwardRef, PropsWithChildren, ReactNode } from 'react';
import { Classes } from '@blueprintjs/core';
import cn from 'classnames';
import Navbar from './Navbar';
import styles from './SettingsPage.module.css';

interface SettingsPageProps extends PropsWithChildren {
  footerContent?: ReactNode;
}

const SettingsPage = forwardRef<HTMLDivElement, SettingsPageProps>(
  ({ children, footerContent }, ref) => {
    return (
      <>
        <div className={Classes.DRAWER_BODY} ref={ref}>
          <div className={Classes.DIALOG_BODY}>
            <Navbar className={styles.nav} />
            {children}
          </div>
        </div>
        {footerContent && (
          <div className={cn(Classes.DRAWER_FOOTER, styles.footer)}>
            {footerContent}
          </div>
        )}
      </>
    );
  }
);

SettingsPage.displayName = 'SettingsPage';

export default SettingsPage;
