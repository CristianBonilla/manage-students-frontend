import { Event, NavigationEnd } from '@angular/router';

const APP_ROUTES = {
  HOME: {
    MAIN: 'home',
    TEACHERS: {
      MAIN: '/home/teachers'
    },
    STUDENTS: {
      MAIN: '/home/students'
    },
    GRADES: {
      MAIN: '/home/grades'
    }
  }
} as const;

const { HOME: ROUTES } = APP_ROUTES;

type HomeRoutes = {
  [K in keyof typeof ROUTES]: string;
};

const SIDEBAR_ROUTES: HomeRoutes = {
  MAIN: ROUTES.MAIN,
  TEACHERS: ROUTES.TEACHERS.MAIN,
  STUDENTS: ROUTES.STUDENTS.MAIN,
  GRADES: ROUTES.GRADES.MAIN
};

Object.freeze(APP_ROUTES);
Object.freeze(SIDEBAR_ROUTES);

const sidebarRouteValues = Object.values(SIDEBAR_ROUTES);

function routeFromSidebar(event: Event) {
  return event instanceof NavigationEnd && sidebarRouteValues.some(route => route === event.url);
}

export {
  APP_ROUTES,
  SIDEBAR_ROUTES,
  routeFromSidebar
};
