import { css } from "@emotion/react";

export const Style = css`
  width: calc(100vw);
  max-width: 600px;
  background-color: #18171c;
  padding-bottom: 8px;
  z-index: 1;

  .header-back {
    height: 2em;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 7px 0 7px;
    gap: 4px;
  }
  .header-top-container {
    display: flex;
    gap: 10px;
    justify-content: space-between;
    margin-top: 8px;
  }
  .header-letter {
    margin: 0 10px;
  }
  .header-letter > .btn {
    font-family:
      Spoqa Han Sans Neo,
      -apple-system,
      BlinkMacSystemFont,
      "Malgun Gothic",
      "맑은 고딕",
      helvetica,
      "Apple SD Gothic Neo",
      sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 1rem;
    line-height: normal;
    letter-spacing: -0.02em;
    color: #d2d2d5;

    background: #20202c;
    border: 1px #343142 solid;
    border-radius: 2px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 54px;
  }

  .header-letter > .header-active {
    border: 1px solid #494558;
    background: #28283a;
  }

  .header-left,
  .header-right {
    border: 1px solid #2a2a41;
    background: #222232;

    font-family:
      Spoqa Han Sans Neo,
      -apple-system,
      BlinkMacSystemFont,
      "Malgun Gothic",
      "맑은 고딕",
      helvetica,
      "Apple SD Gothic Neo",
      sans-serif;
    font-style: normal;
    font-weight: 700;
    font-size: 0.7692307692307693rem; //10px
    line-height: 100%;
    text-align: center;
    letter-spacing: -0.04em;
    color: #d2d2d5;

    display: flex;
    justify-content: center;
    align-items: center;
  }
  .header-center {
    font-family:
      Spoqa Han Sans Neo,
      -apple-system,
      BlinkMacSystemFont,
      "Malgun Gothic",
      "맑은 고딕",
      helvetica,
      "Apple SD Gothic Neo",
      sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 0.6923076923076923rem;
    line-height: normal;
    letter-spacing: -0.02em;
    color: #d2d2d5;

    img {
      width: 0.7692307692307693rem;
      height: 0.7692307692307693rem;
    }
    background-color: #222232;
    border: 1px solid #2a2a41;
    flex: 1;
    display: flex;
    gap: 4px;
    padding-left: 10px;
    width: 10px;
    border-radius: 2px;
    /* justify-content: center; */
    align-items: center;
  }
`;
