declare namespace API {
  type UserInfo = {
    id?: number;
    name?: string;
    email?: string;
    phone?: string;
    status?: number;
    createdAt?: string;
    updatedAt?: string;
  };

  type UserInfoList = {
    data?: UserInfo[];
    total?: number;
    success?: boolean;
  };
}
