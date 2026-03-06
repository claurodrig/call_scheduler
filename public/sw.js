self.addEventListener("push", event => {
  if (!event.data) return;
  const { title, body, data } = event.data.json();
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      vibrate: [100, 50, 100],
      data,
    })
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const data = event.notification.data || {};
  const action = data.action || "home";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientList => {
      const msg = { type: "NOTIF_NAV", action };
      if (clientList.length > 0) {
        const client = clientList[0];
        client.postMessage(msg);
        return client.focus();
      }
      return clients.openWindow("/?action=" + action);
    })
  );
});