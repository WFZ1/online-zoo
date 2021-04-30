(function () {
  /**
   * --------------------------------------------------------------------------------
   *  TOGGLE COLOR MODE
   * --------------------------------------------------------------------------------
   */

  const toggleColorMode = document.querySelector('.toggle-color-mode');

  toggleColorMode.addEventListener('input', () => {
    document.body.classList.toggle('page_dark-mode');
    document.body.classList.toggle('page_light-mode');
  });
}());