import type { NavigationItem } from '../NavBar/NavBar';
import { routes } from 'wasp/client/router';

export const appNavigationItems: NavigationItem[] = [
  { name: 'Home', to: routes.LandingPageRoute.to },
  { name: 'Yao', to: routes.ShakeRoute.to },
];
