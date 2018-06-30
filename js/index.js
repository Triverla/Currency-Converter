window.addEventListener('DOMContentLoaded', () => {
    navigator.serviceWorker.register('sw.js')
    .then(registration => {
      console.log('Service Worker registered:', registration);
    })
    .catch(error => {
      console.error('Service Worker could not be registered:', error);
    });
});
