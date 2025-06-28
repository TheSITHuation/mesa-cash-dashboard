// /assets/js/ui/initSidePanelTriggers.js

export function initSidePanelTriggers() {
  const mesas = document.querySelectorAll('.table-section');

  mesas.forEach((mesa) => {
    let zona = mesa.querySelector('.panel-trigger-zone');

    if (!zona) {
      zona = document.createElement('div');
      zona.classList.add('panel-trigger-zone');
      mesa.appendChild(zona);
    }

    const panel = mesa.querySelector('.side-panel');
    if (!panel) return;

    // Mostrar el panel al pasar el mouse
    zona.addEventListener('mouseenter', () => {
      panel.setAttribute('data-open', 'true');
    });

    // Ocultar panel solo si el mouse sale del panel completamente
    panel.addEventListener('mouseleave', (e) => {
      // Verificamos que el mouse no esté sobre ningún hijo del panel
      const isInside = panel.contains(e.relatedTarget);
      if (!isInside) {
        panel.removeAttribute('data-open');
      }
    });
  });
}
