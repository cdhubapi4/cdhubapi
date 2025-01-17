import dayjs from "dayjs";

export const DefaultCard = ({
  index,
  emoji,
  nickname,
  created_at,
  title,
}: {
  index: number;
  emoji: string;
  nickname: string | null;
  created_at: string;
  title: string;
}) => {
  return (
    <div className="card">
      <div className="title">
        #{index} {emoji} {nickname} {dayjs.utc(created_at).tz("Asia/Seoul").format("YYYY/MM/DD HH:mm")}
      </div>
      <div className="desc">{title}</div>
    </div>
  );
};
