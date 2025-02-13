const fs = require("fs");
const https = require("https");
const { dlAudioVideo } = require("youtube-exec");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

const downloadedList: string[] = [];
// Using Promises
const onStart = async () => {
  for (let i = 0; i < list.length; i++)
    await dlAudioVideo({
      url: list[i],
      folder: "downloads",
      filename: list[i].split("?v=")[1],
      resolution: 720, // 144, 240, 360, 480, 720, 1080, 1440, 2160, or 4320; default: 480
      // 안되면 480으로 한번더
    })
      .then(() => {
        console.info(`[${i + 1}/${list.length + 1}]Video downloaded successfully! 🎥🔊🎉`);
        downloadedList.push(list[i]);
      })
      .catch((err: Error) => console.error("An error occurred:", err.message));
};

const onCheck = async () => {
  // downloadedList에 없는 allList의 항목들을 찾습니다.
  const notInDownloadedList = list.filter((item) => !downloadedList.includes(item));
  console.info("다운로드되지 않은 항목들:", notInDownloadedList);
};

const list = [
  "https://www.youtube.com/watch?v=LAaePG6-488",
  "https://www.youtube.com/watch?v=h0GfiwGtIRA",
  "https://www.youtube.com/watch?v=UMWdICOukOc",
  "https://www.youtube.com/watch?v=Wy7MiRfzLxo",
  "https://www.youtube.com/watch?v=DGNllYwtITg",
  "https://www.youtube.com/watch?v=dEYjTh_0QdQ",
  "https://www.youtube.com/watch?v=p2JR9WmRxfE",
  "https://www.youtube.com/watch?v=3JiLLlz7O6E",
  "https://www.youtube.com/watch?v=W_7ogTA09GI",
  "https://www.youtube.com/watch?v=ymbF88Tkvsc",
  "https://www.youtube.com/watch?v=PCwru-j9QCM",
  "https://www.youtube.com/watch?v=m4NvZpMcVEE",
  "https://www.youtube.com/watch?v=081WjRexF2w",
  "https://www.youtube.com/watch?v=H9eQ7W0l23c",
  "https://www.youtube.com/watch?v=eJnY3Kke4p4",
  "https://www.youtube.com/watch?v=dJeaHClNJ_w",
  "https://www.youtube.com/watch?v=jmqQD1jyvHM",
  "https://www.youtube.com/watch?v=YSCRnsQqnLk",
  "https://www.youtube.com/watch?v=dz0ABDZbrzs",
  "https://www.youtube.com/watch?v=7OGgKlSlMjU",
  "https://www.youtube.com/watch?v=CjtcjFlhvfM",
  "https://www.youtube.com/watch?v=abgaGp8l18g",
  "https://www.youtube.com/watch?v=6i_CMj9atHE",
  "https://www.youtube.com/watch?v=Op_JJ6avkjc",
  "https://www.youtube.com/watch?v=Jl50Ic9y3aw",
  "https://www.youtube.com/watch?v=tRCNqbw5J4Q",
  "https://www.youtube.com/watch?v=TmLdlMrkh3E",
  "https://www.youtube.com/watch?v=R_jCv2Tfi_E",
  "https://www.youtube.com/watch?v=Iqz2Y_qe2M8",
  "https://www.youtube.com/watch?v=Ufs7TDAypAo",
  "https://www.youtube.com/watch?v=hkj4oGrblVk",
  "https://www.youtube.com/watch?v=4S7xaGCfXUA",
  "https://www.youtube.com/watch?v=qxihBJsBIWQ",
  "https://www.youtube.com/watch?v=JUW0WGo6zCA",
  "https://www.youtube.com/watch?v=YuI0haaA57U",
  "https://www.youtube.com/watch?v=R6j7FQKHTrs",
  "https://www.youtube.com/watch?v=Kxo5fugWj6o",
  "https://www.youtube.com/watch?v=2CK4fWekKKg",
  "https://www.youtube.com/watch?v=Sf2I2_GF12Q",
  "https://www.youtube.com/watch?v=VUS3-c_xoRI",
  "https://www.youtube.com/watch?v=Jmp_fDTYeUo",
  "https://www.youtube.com/watch?v=up-6kdHtiLY",
  "https://www.youtube.com/watch?v=SRiNQpYxv-c",
  "https://www.youtube.com/watch?v=FhIi1EHi2mw",
  "https://www.youtube.com/watch?v=3W6GHphQjwc",
  "https://www.youtube.com/watch?v=9B4Z0yBW8XY",
  "https://www.youtube.com/watch?v=EkgaV-m7nJo",
  "https://www.youtube.com/watch?v=hcZ6d2Wf0RI",
  "https://www.youtube.com/watch?v=NODdZp5_a1M",
  "https://www.youtube.com/watch?v=Pr0ZmiaiFlA",
  "https://www.youtube.com/watch?v=T73ahztTTJ4",
  "https://www.youtube.com/watch?v=z9x3PyDXKcY",
  "https://www.youtube.com/watch?v=xPgC1q0XC7g",
  "https://www.youtube.com/watch?v=WYEQ-LhGvHQ",
  "https://www.youtube.com/watch?v=mpSqMq2t5Wc",
  "https://www.youtube.com/watch?v=b02Ad3X2jkk",
  "https://www.youtube.com/watch?v=DZOaY-iYnk0",
  "https://www.youtube.com/watch?v=KrjI7F8JfCg",
  "https://www.youtube.com/watch?v=iUiyurx8410",
  "https://www.youtube.com/watch?v=kh8IIJdKx2g",
  "https://www.youtube.com/watch?v=UAKPSrbmopc",
  "https://www.youtube.com/watch?v=afShMFeqitk",
  "https://www.youtube.com/watch?v=UP_QjF0b__Y",
  "https://www.youtube.com/watch?v=4UVumMQaocI",
  "https://www.youtube.com/watch?v=Bb18GQbJQ9U",
  "https://www.youtube.com/watch?v=ww7kdc4msAA",
  "https://www.youtube.com/watch?v=F5SZG5Epax8",
  "https://www.youtube.com/watch?v=OMGePM1GE7g",
  "https://www.youtube.com/watch?v=mIxSIdmlqS4",
  "https://www.youtube.com/watch?v=Zwgbcq06vNI",
  "https://www.youtube.com/watch?v=j7FXvQiBGaE",
  "https://www.youtube.com/watch?v=lubOINPia5U",
  "https://www.youtube.com/watch?v=OFstgncV6xA",
  "https://www.youtube.com/watch?v=ygI8VVxVtG4",
  "https://www.youtube.com/watch?v=sUrnsMhmZ30",
  "https://www.youtube.com/watch?v=bmkLsqOw1G4",
  "https://www.youtube.com/watch?v=KWdjRmbe-n8",
  "https://www.youtube.com/watch?v=2-m4ZzCp3Ko",
  "https://www.youtube.com/watch?v=qjc777giOHc",
  "https://www.youtube.com/watch?v=0sVW_ljG5HI",
  "https://www.youtube.com/watch?v=M0nwofg5ggE",
  "https://www.youtube.com/watch?v=D-7UV0t8x5E",
  "https://www.youtube.com/watch?v=RxCXTzUoL8k",
  "https://www.youtube.com/watch?v=fXbeG2pMldE",
  "https://www.youtube.com/watch?v=YhW1hOMduic",
  "https://www.youtube.com/watch?v=Mn1qj649bz8",
  "https://www.youtube.com/watch?v=SdHv8GnGRNs",
  "https://www.youtube.com/watch?v=L-apkTs6DCs",
  "https://www.youtube.com/watch?v=nzy35q03ZsY",
  "https://www.youtube.com/watch?v=qdAZDc_NV-Y",
  "https://www.youtube.com/watch?v=WsBhXN2EMMo",
  "https://www.youtube.com/watch?v=-0ijekVDPB0",
  "https://www.youtube.com/watch?v=pWEmymXxjE8",
  "https://www.youtube.com/watch?v=gJHJElOvTYY",
  "https://www.youtube.com/watch?v=SxIO25Ellm4",
  "https://www.youtube.com/watch?v=FoUcl_uK1rc",
  "https://www.youtube.com/watch?v=lvV7_lcnK4o",
  "https://www.youtube.com/watch?v=ypL3sxOXLHY",
  "https://www.youtube.com/watch?v=G_WJuAU4beU",
  "https://www.youtube.com/watch?v=xzmudY82Z1k",
  "https://www.youtube.com/watch?v=e6oAD-oJif8",
  "https://www.youtube.com/watch?v=wF29_tNgstA",
  "https://www.youtube.com/watch?v=eFGAOEAH2Z4",
  "https://www.youtube.com/watch?v=8iVnrx1HVzM",
  "https://www.youtube.com/watch?v=IUJrb-1MtfY",
  "https://www.youtube.com/watch?v=eK_VOYXG7vU",
  "https://www.youtube.com/watch?v=1tpUHFVBq7k",
  "https://www.youtube.com/watch?v=39m1PDVlmhE",
  "https://www.youtube.com/watch?v=LTMeApHm-E0",
  "https://www.youtube.com/watch?v=4J5kgAXmbLI",
  "https://www.youtube.com/watch?v=vtD42N53RGE",
  "https://www.youtube.com/watch?v=Ym4yVDQRr4E",
  "https://www.youtube.com/watch?v=HXPWgJFryBw",
  "https://www.youtube.com/watch?v=BLSx864_cBk",
  "https://www.youtube.com/watch?v=ANyMzS1z_qc",
  "https://www.youtube.com/watch?v=HJ2OMj-Ts2c",
  "https://www.youtube.com/watch?v=8miev0SL0Eo",
  "https://www.youtube.com/watch?v=mu78XGbRgjQ",
  "https://www.youtube.com/watch?v=nngNtwHzBwk",
  "https://www.youtube.com/watch?v=-v_npQQzKmQ",
  "https://www.youtube.com/watch?v=evxDsa1colQ",
  "https://www.youtube.com/watch?v=pvNENWwDZZk",
  "https://www.youtube.com/watch?v=uJyk6wUo9bc",
  "https://www.youtube.com/watch?v=I6coY-DU5ek",
  "https://www.youtube.com/watch?v=Wp-z1n01brg",
  "https://www.youtube.com/watch?v=h8_r3YA7Ylo",
  "https://www.youtube.com/watch?v=5Jwa87jgCxA",
  "https://www.youtube.com/watch?v=gQCIsck2RWg",
  "https://www.youtube.com/watch?v=H_3mO0Qv5Ms",
  "https://www.youtube.com/watch?v=XfQ-_4rmpV0",
  "https://www.youtube.com/watch?v=IahJnHcijc8",
  "https://www.youtube.com/watch?v=sSKXYKXFUKU",
  "https://www.youtube.com/watch?v=LyKNxrhQjME",
  "https://www.youtube.com/watch?v=T4YCsR2oNGk",
  "https://www.youtube.com/watch?v=nyLyDBcc198",
  "https://www.youtube.com/watch?v=Bs8imMsXxj4",
  "https://www.youtube.com/watch?v=kgPB-w30K80",
  "https://www.youtube.com/watch?v=c9tnaFTKKeA",
  "https://www.youtube.com/watch?v=Wh2m1uC_5bs",
  "https://www.youtube.com/watch?v=lsfouT8UfTc",
  "https://www.youtube.com/watch?v=DuZbBTSp1hY",
  "https://www.youtube.com/watch?v=_CLD75U_Mq8",
  "https://www.youtube.com/watch?v=pC9unl0PAzQ",
  "https://www.youtube.com/watch?v=rru0U-XyJPQ",
  "https://www.youtube.com/watch?v=t96XQRRp0uw",
  "https://www.youtube.com/watch?v=PeO3hpIcr08",
  "https://www.youtube.com/watch?v=w0QlJUzumyU",
  "https://www.youtube.com/watch?v=DRPsh7cpjCU",
  "https://www.youtube.com/watch?v=Hg541NkUvYs",
  "https://www.youtube.com/watch?v=qLU0ZPrlJi0",
  "https://www.youtube.com/watch?v=axLUTJpp8vY",
  "https://www.youtube.com/watch?v=4p3eavYp8hQ",
  "https://www.youtube.com/watch?v=6jqfmSfQ1G0",
  "https://www.youtube.com/watch?v=babqhDb7Y68",
  "https://www.youtube.com/watch?v=0t9_FuD-vdE",
  "https://www.youtube.com/watch?v=bElYTIhDsyU",
  "https://www.youtube.com/watch?v=oPzXwF5zMhg",
];

onStart();
onCheck();
