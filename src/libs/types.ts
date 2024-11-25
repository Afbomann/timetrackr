export type TAuthenticatedToken = {
  id: string;
  firstName: string;
  type: string;
};

export type TServerActionResponse = {
  err?: string;
  suc?: string;
};
