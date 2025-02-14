/**
 * Function for updating the background of the page
 */

const updateBackground = function (background?: string) {
  const styleText = background
    ? `
    min-height: 100vh;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url(${background});
  `
    : "";

  document.body.style.cssText = styleText;
};

export default updateBackground;
