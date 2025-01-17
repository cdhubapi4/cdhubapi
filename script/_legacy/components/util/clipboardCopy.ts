import { isApp } from "./constant";

export const clipboardCopyV2 = (text: string, onSuccess?: () => void, isShare = true) => {
  if (isApp) {
    if (onSuccess) onSuccess();
    window.Android.copyToClipboard(text);
    return;
  }
  const isSecure = window.location.origin.includes("https") && window.isSecureContext;
  if (isSecure && window.navigator.share && isShare)
    window.navigator
      .share({ title: text.slice(0, 20), text: text, url: text })
      .catch(() => alert("데이터가 너무 커서 클립보드에 복사할 수 없습니다."));
  else if (navigator.clipboard) {
    if (onSuccess) onSuccess();
    navigator.clipboard.writeText(text).catch(() => alert("복사를 다시 시도해주세요."));
  } else {
    if (!document.queryCommandSupported("copy")) return alert("복사하기가 지원되지 않는 브라우저입니다.");
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
};
