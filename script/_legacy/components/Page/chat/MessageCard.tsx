import dayjs from "dayjs";
import { MessageType } from "./MessageList";

type Props = {
  id?: string;
  message: MessageType;
  chatBackgroundColor?: string;
};

const transformYouTubeLinks = (content: string) => {
  if (content.includes("youtube.com") || content.includes("youtu.be")) {
    return content.replace(
      /https:\/\/(www\.|m\.)?youtube\.com\/watch\?v=([\w\-]+)|https:\/\/youtu\.be\/([\w\-]+)/g,
      (match, _, group1, group2) =>
        `<iframe width="100%" style="border: none" height="315" src="https://www.youtube.com/embed/${
          group1 || group2
        }" title="YouTube video player" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>`
    );
  }
  if (content.includes("https://"))
    content = content.replace(
      /https?:\/\/[^\s]+/g,
      (match) =>
        `<a href="${match}" style="color:#4242fb" target="_blank" rel="noopener noreferrer" onclick="return confirm('외부로 연결된 링크입니다. 정말 이 링크를 열겠습니까?');">${match}</a>`
    );
  return content;
};

export const MessageCard = ({ id, message, chatBackgroundColor }: Props) => {
  const transformedContent = transformYouTubeLinks(message.content);
  return (
    <button className="chat" disabled id={id}>
      <div className="chat-info">
        {`#${message.index} `}
        <div className="chat-emoji">{message.profile_emoji}</div>
        {` ${message.nickname} `}
        <span>{dayjs(message.created_at).format("YYYY/MM/DD HH:mm")}</span>
      </div>
      <div className="chat-message" style={{ background: chatBackgroundColor }}>
        <div dangerouslySetInnerHTML={{ __html: transformedContent }} />
        {/* {youtubeId ? (
          <iframe
            width="100%"
            style={{ border: "none" }}
            height="315"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title="YouTube video player"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div dangerouslySetInnerHTML={{ __html:  }} />
        )} */}
      </div>
    </button>
  );
};
