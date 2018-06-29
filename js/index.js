window.addEventListener('DOMContentLoaded', function () {
    navigator.serviceWorker.register('sw.js')
    .then(function(registration) {
      console.log('Service Worker registered:', registration);
    })
    .catch(function(error) {
      console.error('Service Worker could not be registered:', error);
    });
});