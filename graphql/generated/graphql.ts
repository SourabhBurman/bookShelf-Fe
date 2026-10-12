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

export type AuditLog = {
  __typename?: 'AuditLog';
  action?: Maybe<Scalars['String']['output']>;
  actorEmail?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  details?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  targetId?: Maybe<Scalars['String']['output']>;
  targetType?: Maybe<Scalars['String']['output']>;
};

export type Book = {
  __typename?: 'Book';
  author?: Maybe<Scalars['String']['output']>;
  averageRating?: Maybe<Scalars['Float']['output']>;
  cost?: Maybe<Scalars['Float']['output']>;
  coverImage?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  genre?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  publishedDate?: Maybe<Scalars['Date']['output']>;
  quantityAvailable?: Maybe<Scalars['Int']['output']>;
  rentPrice?: Maybe<Scalars['Float']['output']>;
  reviews: Array<Review>;
  /** Real, currently-borrowable stock: the sum of this book's quantityAvailable across every library that stocks it (unlike the quantityAvailable field above, which is just the unassigned shared pool). */
  totalAvailableCopies?: Maybe<Scalars['Int']['output']>;
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
  author?: InputMaybe<Scalars['String']['input']>;
  cost?: InputMaybe<Scalars['Float']['input']>;
  coverImage?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  genre?: InputMaybe<Genre>;
  name: Scalars['String']['input'];
  publishedDate?: InputMaybe<Scalars['Date']['input']>;
  quantityAvailable?: InputMaybe<Scalars['Int']['input']>;
  rentPrice?: InputMaybe<Scalars['Float']['input']>;
};

export type BookPaginationInput = {
  pageNumber?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};

export type BookQuantityInput = {
  bookId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
};

export type CreateReviewInput = {
  bookId: Scalars['ID']['input'];
  comment?: InputMaybe<Scalars['String']['input']>;
  rating: Scalars['Int']['input'];
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
  SciFi = 'SciFi',
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
  balance?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** A book as stocked by one specific library — its own copy counts, distinct from the shared catalog Book.quantityAvailable */
export type LibraryBook = {
  __typename?: 'LibraryBook';
  book?: Maybe<Book>;
  id?: Maybe<Scalars['ID']['output']>;
  library?: Maybe<Library>;
  quantityAvailable?: Maybe<Scalars['Int']['output']>;
  totalQuantities?: Maybe<Scalars['Int']['output']>;
};

export type LibraryBookInput = {
  books?: InputMaybe<Array<BookQuantityInput>>;
  isAll?: InputMaybe<Scalars['Boolean']['input']>;
  library: Scalars['ID']['input'];
  quantityForIsAll?: InputMaybe<Scalars['Int']['input']>;
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
  createPaymentIntent: PaymentIntentResponse;
  createPermission: Permission;
  createReview: Review;
  createRole?: Maybe<Role>;
  deleteBook?: Maybe<Response>;
  deleteLibrary?: Maybe<Library>;
  deletePermission: Response;
  deleteReview?: Maybe<Response>;
  deleteRole?: Maybe<Response>;
  deleteUser?: Maybe<Response>;
  joinWaitlist: Waitlist;
  leaveWaitlist?: Maybe<Response>;
  markAllNotificationsRead?: Maybe<Response>;
  markNotificationRead?: Maybe<Notification>;
  returnOrder: Array<Maybe<Order>>;
  saveBook: SavedBook;
  unsaveBook?: Maybe<Response>;
  updateBook?: Maybe<Book>;
  updateLibrary?: Maybe<Library>;
  updateLibraryBook?: Maybe<LibraryBook>;
  updatePermission: Permission;
  updateRole?: Maybe<Role>;
  updateUser?: Maybe<User>;
};


export type MutationAddBookToLibraryArgs = {
  input: LibraryBookInput;
};


export type MutationCreateBookArgs = {
  input: BookInput;
};


export type MutationCreateLibraryArgs = {
  input: LibraryInput;
};


export type MutationCreatePaymentIntentArgs = {
  input: PlaceOrderInput;
};


export type MutationCreatePermissionArgs = {
  input: PermissionInput;
};


export type MutationCreateReviewArgs = {
  input: CreateReviewInput;
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


export type MutationDeleteReviewArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteRoleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationJoinWaitlistArgs = {
  bookId: Scalars['ID']['input'];
};


export type MutationLeaveWaitlistArgs = {
  bookId: Scalars['ID']['input'];
};


export type MutationMarkNotificationReadArgs = {
  id: Scalars['ID']['input'];
};


export type MutationReturnOrderArgs = {
  input: Array<InputMaybe<UpdateOrderInput>>;
};


export type MutationSaveBookArgs = {
  bookId: Scalars['ID']['input'];
};


export type MutationUnsaveBookArgs = {
  bookId: Scalars['ID']['input'];
};


export type MutationUpdateBookArgs = {
  id: Scalars['ID']['input'];
  input: UpdateBookInput;
};


export type MutationUpdateLibraryArgs = {
  id: Scalars['ID']['input'];
  input: LibraryInput;
};


export type MutationUpdateLibraryBookArgs = {
  id: Scalars['ID']['input'];
  input: UpdateLibraryBookInput;
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

export type Notification = {
  __typename?: 'Notification';
  createdAt?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isRead?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Order>;
  type?: Maybe<NotificationType>;
};

export enum NotificationType {
  DueSoon = 'DueSoon',
  General = 'General',
  OrderUpdate = 'OrderUpdate',
  Overdue = 'Overdue'
}

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
  createdAt?: Maybe<Scalars['Date']['output']>;
  current_status?: Maybe<OrderStatus>;
  expectedReturnDate?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  library?: Maybe<Library>;
  transactions?: Maybe<Array<Maybe<Transaction>>>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  user?: Maybe<User>;
};

export enum OrderStatus {
  Borrowed = 'Borrowed',
  Cancelled = 'Cancelled',
  Purchased = 'Purchased',
  Returned = 'Returned'
}

export type PaymentIntentResponse = {
  __typename?: 'PaymentIntentResponse';
  amount: Scalars['Int']['output'];
  clientSecret: Scalars['String']['output'];
  currency: Scalars['String']['output'];
};

export enum PaymentStatus {
  Failed = 'Failed',
  Paid = 'Paid',
  Pending = 'Pending'
}

/** Server-side outcome of a Stripe payment, as recorded by the webhook */
export type PaymentStatusResponse = {
  __typename?: 'PaymentStatusResponse';
  bookName?: Maybe<Scalars['String']['output']>;
  orderId?: Maybe<Scalars['ID']['output']>;
  orderStatus?: Maybe<OrderStatus>;
  paymentIntentId: Scalars['String']['output'];
  paymentStatus: PaymentStatus;
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
  bookId: Scalars['ID']['input'];
  expectedReturnDate?: InputMaybe<Scalars['Date']['input']>;
  libraryId: Scalars['ID']['input'];
  transactionType: TransactionType;
};

export type Query = {
  __typename?: 'Query';
  /** Admin-only: every review across the whole catalog, newest first */
  getAllReviews: Array<Review>;
  /** Admin-only: recent audit log entries, newest first */
  getAuditLogs: Array<AuditLog>;
  getBook?: Maybe<Book>;
  /** A curated array of listings to feature on the homepage */
  getBooks: Array<Book>;
  getBooksByLibrary: Array<LibraryBook>;
  getLibraries?: Maybe<Array<Library>>;
  getLibraryById?: Maybe<Library>;
  /** Orders placed against the library owned by the current user */
  getLibraryOrders: Array<Order>;
  /** The current user's own waitlist entries */
  getMyWaitlist: Array<Waitlist>;
  /** The current user's own notifications, newest first */
  getNotifications: Array<Notification>;
  getOrder?: Maybe<Order>;
  getOrders: Array<Order>;
  /** Polled by the checkout success page until the webhook settles the payment */
  getPaymentStatus: PaymentStatusResponse;
  getPermission?: Maybe<Permission>;
  getPermissions: Array<Permission>;
  getReviewsForBook: Array<Review>;
  getRole?: Maybe<RoleWithPermissions>;
  getRoles: Array<Role>;
  /** The current user's own saved / want-to-read books */
  getSavedBooks: Array<SavedBook>;
  getTransactionsForOrder: Array<Transaction>;
  getUnreadNotificationCount: Scalars['Int']['output'];
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


export type QueryGetPaymentStatusArgs = {
  paymentIntentId: Scalars['String']['input'];
};


export type QueryGetPermissionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetReviewsForBookArgs = {
  bookId: Scalars['ID']['input'];
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

export type Review = {
  __typename?: 'Review';
  book?: Maybe<Book>;
  comment?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  rating?: Maybe<Scalars['Int']['output']>;
  user?: Maybe<User>;
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

export type SavedBook = {
  __typename?: 'SavedBook';
  book?: Maybe<Book>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type Transaction = {
  __typename?: 'Transaction';
  amount?: Maybe<Scalars['Int']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  order?: Maybe<Order>;
  paymentStatus?: Maybe<Scalars['String']['output']>;
  stripePaymentIntentId?: Maybe<Scalars['String']['output']>;
  transactionDate?: Maybe<Scalars['Date']['output']>;
  transactionType?: Maybe<TransactionType>;
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

export type UpdateLibraryBookInput = {
  quantityAvailable?: InputMaybe<Scalars['Int']['input']>;
  totalQuantities?: InputMaybe<Scalars['Int']['input']>;
};

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
  library_owned?: Maybe<Library>;
  name?: Maybe<Scalars['String']['output']>;
  refreshToken?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Role>;
};

export type Waitlist = {
  __typename?: 'Waitlist';
  book?: Maybe<Book>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
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
