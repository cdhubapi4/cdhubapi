import { Style } from "./Header.style";
import { Center } from "./Center";
import { Right } from "./Right";
import { Left } from "./Left";
import { UserDataType } from "@/components/util/getUserData";

type Props = {
  position?: "static" | "relative" | "absolute" | "sticky" | "fixed";
  page: number;
  userData: UserDataType;
};

export const Header = ({ position, page, userData }: Props) => {
  const getLeftType = () => {
    if ([4, 5, 6, 9, 13].includes(page)) return "back";
    if ([2].includes(page)) return "back-home";
    if ([0, 1].includes(page)) return "community";
    if ([3, 6, 7, 8].includes(page)) return "letter";
    if ([-1].includes(page)) return "home";
    return null;
  };
  const getCenterType = () => {
    if ([0, 1, 3].includes(page)) return "megaphone";
    if ([5].includes(page)) return "message-detail";
    if ([6].includes(page)) return "community-message-detail";
    if ([9].includes(page)) return "search";
    if ([13].includes(page)) return "user";
    return null;
  };
  const getRightType = () => {
    if ([5].includes(page)) return "message-detail";
    if ([0, 1, 7, 8].includes(page)) return "setting";
    if ([6].includes(page)) return "community-message-detail";
    if ([3].includes(page)) return "search";
    if ([9].includes(page)) return "search-icon";
    if ([13].includes(page)) return "user";
    return null;
  };

  return (
    <nav css={Style} style={{ position, opacity: [4, 7, 8].includes(page) ? 0 : 1 }}>
      <div className="header-top-container">
        <Left type={getLeftType()} userData={userData} />
        <Center type={getCenterType()} userData={userData} />
        <Right type={getRightType()} userData={userData} />
      </div>
      {/* <Bottom type={getBottomType()} page={page} /> */}
    </nav>
  );
};
