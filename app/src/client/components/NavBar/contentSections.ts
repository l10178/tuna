import type { NavigationItem } from '../NavBar/NavBar';
import { routes } from 'wasp/client/router';
import { BlogUrl, DocsUrl } from '../../../shared/common';

export const appNavigationItems: NavigationItem[] = [
  { name: 'Home', to: routes.LandingPageRoute.to },
  { name: 'Documentation', to: DocsUrl },
  { name: 'Blog', to: BlogUrl },
  { name: 'Yao', to: routes.ShakeRoute.to },
];
