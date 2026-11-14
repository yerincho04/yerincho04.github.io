const dialog = document.querySelector('#figure-dialog');
const expanded = document.querySelector('#expanded-figure');

document.querySelectorAll('[data-figure]').forEach(link => {
  link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || typeof dialog.showModal !== 'function') return;
    const image = link.closest('figure').querySelector('img');
    event.preventDefault();
    expanded.src = image.src;
    expanded.alt = image.alt;
    document.querySelector('#figure-description').textContent = image.alt;
    dialog.showModal();
  });
});

document.querySelector('#close-figure').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  }
});
