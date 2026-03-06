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

  // Broadcast to all tabs via BroadcastChannel
  const bc = new BroadcastChannel("notif_nav");
  bc.postMessage({ type: "NOTIF_NAV", action });
  bc.close();

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientList => {
      if (clientList.length > 0) return clientList[0].focus();
      return clients.openWindow("/?action=" + action);
    })
  );
});