self.addEventListener("install", (event) => {
  console.info("Service Worker 설치됨");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});

// Web Push Notification
self.addEventListener("push", (event) => {
  const title = "스페이스챗";
  const options = {
    body: "🪐새 쪽지 알림이 허용되었습니다",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
