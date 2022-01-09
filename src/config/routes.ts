export enum ROUTES_AUTH {
  LOGIN = 'LOGIN',
}

export enum ROUTES_MAIN {
  GROUPS = 'GROUPS',
  MESSAGES = 'MESSAGES',
}

const routes = {
  ...ROUTES_AUTH,
  ...ROUTES_MAIN,
};

export default routes;
export type RoutesTypes = keyof typeof routes;
