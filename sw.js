// Сервис-воркер прототипа Тикетной. Нужен для системных уведомлений: Android и iPhone показывают их только через него,
// а клик по уведомлению возвращает во вкладку и открывает тикет. Ничего не кэширует.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const data = e.notification.data || {};
  e.waitUntil((async () => {
    const wins = await self.clients.matchAll({type: 'window', includeUncontrolled: true});
    if (wins.length){
      await wins[0].focus();
      if (data.ticket) wins[0].postMessage({open: data.ticket, fav: data.fav});
      return;
    }
    await self.clients.openWindow(data.url || self.registration.scope);
  })());
});
