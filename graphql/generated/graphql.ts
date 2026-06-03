export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: unknown; output: unknown; }
};

export type Book = {
  __typename?: 'Book';
  cost?: Maybe<Scalars['Float']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  genre?: Maybe<Genre>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  publishedDate?: Maybe<Scalars['Date']['output']>;
  quantityAvailable?: Maybe<Scalars['Int']['output']>;
  rentPrice?: Maybe<Scalars['Float']['output']>;
};

export enum BookFields {
  Cost = 'cost',
  Genre = 'genre',
  Id = 'id',
  Name = 'name',
  PublishedDate = 'publishedDate',
  RentPrice = 'rentPrice'
}

export type BookFilterInput = {
  and?: InputMaybe<Array<BookFilterInput>>;
  field?: InputMaybe<BookFields>;
  operator?: InputMaybe<OperatorFields>;
  or?: InputMaybe<Array<BookFilterInput>>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type BookInput = {
  cost?: InputMaybe<Scalars['Float']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  genre?: InputMaybe<Genre>;
  name: Scalars['String']['input'];
  quantityAvailable?: InputMaybe<Scalars['Int']['input']>;
  rentPrice?: InputMaybe<Scalars['Float']['input']>;
};

export type BookPaginationInput = {
  pageNumber?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  gender?: InputMaybe<Gender>;
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export enum Gender {
  Female = 'Female',
  Male = 'Male',
  Other = 'Other'
}

export enum Genre {
  Adventure = 'Adventure',
  Biography = 'Biography',
  Business = 'Business',
  Drama = 'Drama',
  Fantasy = 'Fantasy',
  Finance = 'Finance',
  Health = 'Health',
  History = 'History',
  Horror = 'Horror',
  Mystery = 'Mystery',
  Other = 'Other',
  Romance = 'Romance',
  SelfHelp = 'SelfHelp',
  Technology = 'Technology',
  Thriller = 'Thriller'
}

export type Id = {
  id: Scalars['ID']['input'];
};

export type Library = {
  __typename?: 'Library';
  address?: Maybe<Scalars['String']['output']>;
  balance?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type LibraryInput = {
  address: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addBookToLibrary?: Maybe<Response>;
  createBook: Book;
  createLibrary?: Maybe<Library>;
  createPermission: Permission;
  createRole?: Maybe<Role>;
  deleteBook?: Maybe<Response>;
  deleteLibrary?: Maybe<Library>;
  deletePermission: Response;
  deleteRole?: Maybe<Response>;
  deleteUser?: Maybe<Response>;
  placeOrder: Array<Maybe<Order>>;
  returnOrder: Array<Maybe<Order>>;
  updateBook?: Maybe<Book>;
  updateLibrary?: Maybe<Library>;
  updatePermission: Permission;
  updateRole?: Maybe<Role>;
  updateUser?: Maybe<User>;
};


export type MutationAddBookToLibraryArgs = {
  id: Scalars['ID']['input'];
  input: LibraryInput;
};


export type MutationCreateBookArgs = {
  input: BookInput;
};


export type MutationCreateLibraryArgs = {
  input: LibraryInput;
};


export type MutationCreatePermissionArgs = {
  input: PermissionInput;
};


export type MutationCreateRoleArgs = {
  input: RoleInput;
};


export type MutationDeleteBookArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteLibraryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePermissionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteRoleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationPlaceOrderArgs = {
  input: Array<InputMaybe<PlaceOrderInput>>;
};


export type MutationReturnOrderArgs = {
  input: Array<InputMaybe<UpdateOrderInput>>;
};


export type MutationUpdateBookArgs = {
  id: Scalars['ID']['input'];
  input: UpdateBookInput;
};


export type MutationUpdateLibraryArgs = {
  id: Scalars['ID']['input'];
  input: LibraryInput;
};


export type MutationUpdatePermissionArgs = {
  id: Scalars['ID']['input'];
  input: PermissionInput;
};


export type MutationUpdateRoleArgs = {
  id: Scalars['ID']['input'];
  input: RoleInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input: UpdateUserInput;
};

export enum OperatorFields {
  Eq = 'Eq',
  Gt = 'Gt',
  Gte = 'Gte',
  In = 'In',
  Like = 'Like',
  Lt = 'Lt',
  Lte = 'Lte'
}

export type Order = {
  __typename?: 'Order';
  book?: Maybe<Book>;
  expectedReturnDate?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  transactionDate?: Maybe<Scalars['Date']['output']>;
  transactionType?: Maybe<TransactionType>;
  user?: Maybe<User>;
};

export type Permission = {
  __typename?: 'Permission';
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type PermissionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type PlaceOrderInput = {
  book: Scalars['ID']['input'];
  expectedReturnDate?: InputMaybe<Scalars['Date']['input']>;
  library: Scalars['ID']['input'];
  transactionType: TransactionType;
};

export type Query = {
  __typename?: 'Query';
  getBook?: Maybe<Book>;
  /** A curated array of listings to feature on the homepage */
  getBooks: Array<Book>;
  getBooksByLibrary: Array<Book>;
  getLibraries?: Maybe<Array<Library>>;
  getLibraryById?: Maybe<Library>;
  getOrder?: Maybe<Order>;
  getOrders: Array<Order>;
  getPermission?: Maybe<Permission>;
  getPermissions: Array<Permission>;
  getRole?: Maybe<RoleWithPermissions>;
  getRoles: Array<Role>;
  getTransactionsForOrder: Array<Transaction>;
  getUser?: Maybe<User>;
  getUsers?: Maybe<Array<User>>;
};


export type QueryGetBookArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetBooksArgs = {
  filter?: InputMaybe<BookFilterInput>;
  pagination?: InputMaybe<BookPaginationInput>;
};


export type QueryGetBooksByLibraryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetLibraryByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetOrderArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetPermissionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetRoleArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetTransactionsForOrderArgs = {
  orderId: Scalars['ID']['input'];
};


export type QueryGetUserArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type Response = {
  __typename?: 'Response';
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type ReturnUser = {
  __typename?: 'ReturnUser';
  email?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Gender>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Role>;
};

export type Role = {
  __typename?: 'Role';
  displayName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  type?: Maybe<User_Roles>;
};

export type RoleInput = {
  displayName: Scalars['String']['input'];
  permissions?: InputMaybe<Array<Id>>;
  type: User_Roles;
};

export type RoleWithPermissions = {
  __typename?: 'RoleWithPermissions';
  displayName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  permissions?: Maybe<Array<Permission>>;
  role?: Maybe<User_Roles>;
};

export type Transaction = {
  __typename?: 'Transaction';
  book?: Maybe<Book>;
  dueDate?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  transactionDate?: Maybe<Scalars['Date']['output']>;
  transactionType?: Maybe<TransactionType>;
  user?: Maybe<ReturnUser>;
};

export enum TransactionType {
  Borrow = 'Borrow',
  Publish = 'Publish',
  Purchase = 'Purchase',
  Return = 'Return'
}

export enum User_Roles {
  Admin = 'Admin',
  LibraryOwner = 'Library_Owner',
  Reader = 'Reader'
}

export type UpdateOrderInput = {
  expectedReturnDate?: InputMaybe<Scalars['Date']['input']>;
  id: Scalars['ID']['input'];
  transactionType: TransactionType;
};

export type UpdateUserInput = {
  gender?: InputMaybe<Gender>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  accessToken?: Maybe<Scalars['String']['output']>;
  balance?: Maybe<Scalars['Float']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Gender>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  refreshToken?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Role>;
};

export type UpdateBookInput = {
  cost?: InputMaybe<Scalars['Float']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  genre?: InputMaybe<Genre>;
  name?: InputMaybe<Scalars['String']['input']>;
  publishedDate?: InputMaybe<Scalars['Date']['input']>;
  quantityAvailable?: InputMaybe<Scalars['Int']['input']>;
  rentPrice?: InputMaybe<Scalars['Float']['input']>;
};
