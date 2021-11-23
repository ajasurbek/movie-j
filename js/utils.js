let $_ = function (selector, node = document) {
  return node.querySelector(selector);
};

let $$_ = function (selector, node = document) {
  return node.querySelectorAll(selector);
};

let createElement = function (tagName, className, text) {
  let element = document.createElement(tagName);
  element.setAttribute('class', className);

  if (text) {
    element.textContent = text;
  }

  return element;
};

let getYoutubeVideoLink = function (videoId) {
  return `https://youtube.com/watch?v=${videoId}`;
};

let getYoutubeVideoBigThumbnail = function (videoId) {
  return `http://i3.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
};

let getYoutubeVideoThumbnail = function (videoId) {
  return `http://i3.ytimg.com/vi/${videoId}/hqdefault.jpg`;
};
