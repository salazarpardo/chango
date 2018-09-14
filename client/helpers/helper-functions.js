formatSlug = function(value) {
  var formatted = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/ /g, "-")
    .replace(/[-]+/g, "-")
    .replace(/[^\w\x80-\xFF-]+/g, "")
    .replace(/[\u0300-\u036f]/g, "");
  return formatted;
};
