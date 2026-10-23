self.addEventListener("push", function (event) {
  if (!event.data) {
    console.log("Push event has no data.");
    return;
  }

  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    console.error("Error parsing push data:", e);
    return;
  }

  const notification = data.notification || {};
  const title = notification.title || "NoroFarm";
  const options = {
    body: notification.body || "",
    icon: notification.icon || "/logo.png",
    badge: notification.badge || "/logo.png",
    data: notification.data || { url: "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const urlToOpen = event.notification.data ? event.notification.data.url : "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (windowClients) {
      // Nếu đã có tab đang mở trang NoroFarm, di chuyển focus tới tab đó và redirect
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url.indexOf(location.origin) === 0 && "focus" in client) {
          client.postMessage({ action: "navigate", url: urlToOpen });
          return client.focus();
        }
      }
      // Nếu chưa có, mở cửa sổ mới
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
