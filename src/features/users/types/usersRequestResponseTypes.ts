export type UsersSearchAndPaginationType = {
  pageNumber: number;
  pageSize: number;
  sortBy: any;
  sortDirection?: 'asc' | 'desc';
  searchLoginTerm?: string;
  searchEmailTerm?: string;
};

export type UserRequestTypeWithBody = {
  login: string;
  email: string;
  password: string;
};
export type UserRequestWithParamsType = {
  id: string;
};
export type UserRequestWithQueryType = {
  pageNumber: number;
  pageSize: number;
  sortBy: any;
  sortDirection: string;
  searchLoginTerm: any;
  searchEmailTerm: any;
};
