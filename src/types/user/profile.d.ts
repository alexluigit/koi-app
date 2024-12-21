export interface BaseProfile {
  id: number;
  avatar: string;
  account: string;
  nickname?: string;
}

export type ProfileDetail = BaseProfile & {
  gender?: Gender;
  birthday?: string;
  fullLocation?: string;
  profession?: string;
};

export type Gender = '女' | '男';

// export interface ProfileReq {
//   user_id?: string;
// }

// export interface ProfileRes {
//   user_id?: string;
//   user_name?: string;
//   avatar?: string;
//   token?: string;
// }

export type ProfileParams = Pick<
  ProfileDetail,
  'nickname' | 'gender' | 'birthday' | 'profession'
> & {
  provinceCode?: string;
  cityCode?: string;
  countyCode?: string;
};
