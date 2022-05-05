module.exports.escapeRegExp = function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
};

module.exports.replaceInArray = function replace(arr, index, replacement) {
  return [...arr.slice(0, index), replacement, ...arr.slice(index + 1)];
};
