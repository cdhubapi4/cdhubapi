// TabHeader.js
import { css } from "@emotion/react";

function TabHeader({ tabIndex, setTabIndex }: { tabIndex: number; setTabIndex: (index: number) => void }) {
  return (
    <div css={tabHeaderStyle}>
      <div className={`tab-item ${tabIndex === 0 ? "active" : ""}`} onClick={() => setTabIndex(0)}>
        쪽지 목록
      </div>
      <div className={`tab-item ${tabIndex === 1 ? "active" : ""}`} onClick={() => setTabIndex(1)}>
        새 쪽지 쓰기
      </div>
      <div className="tab-indicator" style={{ transform: `translateX(${tabIndex * 100}%)` }}>
        <div />
      </div>
    </div>
  );
}

const tabHeaderStyle = css`
  display: flex;
  position: relative;
  padding-top: 50px;

  .tab-item {
    flex: 1;
    text-align: center;
    cursor: pointer;
    padding: 10px 10px 20px 10px;
  }

  color: #d2d2d5ac;
  font-family:
    Spoqa Han Sans Neo,
    -apple-system,
    BlinkMacSystemFont,
    "Malgun Gothic",
    "맑은 고딕",
    helvetica,
    "Apple SD Gothic Neo",
    sans-serif;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 0.9230769230769231rem;
  letter-spacing: -0.26px;

  .active {
    color: white;
  }

  .tab-indicator {
    position: absolute;
    bottom: 0;

    width: calc(50% - 100px);
    padding: 0 50px;

    transition: transform 0.3s ease;
    div {
      height: 2px;
      background-color: #982c2c;
    }
  }
`;

export default TabHeader;
