import { css } from "@emotion/react";
import { atom, useRecoilState } from "recoil";

export const ModalState = atom<JSX.Element | null>({
  key: "ModalState",
  default: null,
});

export const Modal = () => {
  const [modalData, setModalData] = useRecoilState(ModalState);

  if (!modalData) return null;
  return (
    <div css={Style} onClick={() => setModalData(null)}>
      <div id="box" onClick={(e) => e.stopPropagation()}>
        {modalData}
      </div>
    </div>
  );
};

const Style = css`
  background-color: rgba(0, 0, 0, 0.6);
  width: 100vw;
  height: var(--vh);

  position: fixed;
  top: 0;
  z-index: 100;

  display: flex;
  justify-content: center;
  align-items: center;

  #box {
    position: relative;
    display: flex;
    flex-direction: column;
    top: calc(var(--vh) * -0.1);

    border-radius: 4px;
    background: #18171c;
    box-shadow: 0px 10px 10px 0px rgba(0, 0, 0, 0.25);

    border-radius: 4px;
  }
`;

export const DefaultModalTemplete = (element: JSX.Element) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "16px 16px",
        width: "min(calc(100vw - 120px), 480px)",
      }}
    >
      {element}
    </div>
  );
};
export const SelectModalTemplete = (buttonList: [title: string, onClick: () => void][]) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "16px 16px",
        width: "min(calc(100vw - 120px), 480px)",
      }}
    >
      {buttonList.map((b) => (
        <button className="button-dark" onClick={b[1]} key={b[0]}>
          {b[0]}
        </button>
      ))}
    </div>
  );
};
