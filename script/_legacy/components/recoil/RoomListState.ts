export type RoomType = {
  thread_id: number;
  created_user_id: number;
  title: string;
  nickname: string;
  modified_at: string;
  created_at: string;
  profile_emoji: string;
  last_send_user_id: number;
  last_index: number;
  other_user_id: number | null;
};
