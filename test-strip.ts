function stripOklch(element) {
  const elements = element.querySelectorAll('*');
  elements.forEach(el => {
    // If we just remove all tailwind classes, it won't have oklch!
    el.className = '';
  });
}
