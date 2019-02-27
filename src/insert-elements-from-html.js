const insertElementsFromHtml = (parent, htmlString) =>{
  const parser = new DOMParser();
  const html = parser.parseFromString(htmlString, `text/html`);
  const fragment = document.createDocumentFragment();

  html.body.childNodes.forEach((node) => {
    fragment.appendChild(node);
  });

  parent.appendChild(fragment);
};

export default insertElementsFromHtml;
