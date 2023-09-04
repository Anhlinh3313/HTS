export interface IAccount {
    token: string;
    user: {
      id: number;
      name: string;
      org: number;
      email: string;
      is_using_social_avatar: boolean;
      social_avatar_hash: string;
      avatar: string;
      phone_number: string;
      birthday: any;
    };
  }