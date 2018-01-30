String.prototype.stripTags =  function() {
  return this.replace(/<\/?[^>]+>/gi, '');
};

String.prototype.underlineToCamel = function(bigCamel) {
  if (this.length === 0) {
    return this;
  }
  var chars = [];
  chars.push(bigCamel ? this[0].toUpperCase() : this[0].toLowerCase());
  for (var i = 1; i < this.length; i ++ ) {
    chars.push(this[i - 1] === '_' ? this[i].toUpperCase() : this[i].toLowerCase());
  }
  return chars.join('').replace(/_/gi, '');
};

String.prototype.trim = function(s) {
  if (s === undefined || s === null || s === '') {
    return this.replace(/(^\s*)|(\s*$)/g, '');
  }
  var res = this;
  while (res.endsWith(s)) {
    res = res.substring(0, res.length - s.length);
  }
  while (res.startsWith(s)) {
    res = res.substring(s.length, res.length);
  }
  return res;
};

String.prototype.contains = function(s) {
  return this.indexOf(s) !== -1;
};

String.prototype.startsWith = function(prefix) {
  return prefix === undefined || prefix === null || prefix === '' ? false : this.slice(0, prefix.length) === prefix;
};

String.prototype.endsWith = function(suffix) {
  return suffix === undefined || suffix === null || suffix === '' ? false : this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.containAll = function() {
  var args = arguments[0] instanceof Array ? arguments[0] : arguments;
  for (var i = 0; i < args.length; i++) {
    if (!this.contains(args[i])) {
      return false;
    }
  }
  return true;
};

String.prototype.containAny = function() {
  var args = arguments[0] instanceof Array ? arguments[0] : arguments;
  for (var i = 0; i < args.length; i++) {
    if (this.contains(args[i])) {
      return true;
    }
  }
  return false;
};

Date.prototype.format = function(format) {
  var d = this;
  var res = (format || 'yyyy-MM-dd hh:mm:ss').replace('yyyy',  d.getFullYear()).replace('YYYY',  d.getFullYear());
  res = res.replace('MM', d.getMonth() < 9 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1));
  res = res.replace('dd', d.getDate() < 10 ? '0' + d.getDate() : d.getDate()).replace('DD', d.getDate() < 10 ? '0' + d.getDate() : d.getDate());
  res = res.replace('hh', d.getHours() < 10 ? '0' + d.getHours() : d.getHours()).replace('HH', d.getHours() < 10 ? '0' + d.getHours() : d.getHours());
  res = res.replace('mm', d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes());
  res = res.replace('ss', d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds());
  var millisecond = d.getMilliseconds();
  millisecond = millisecond < 10 ? '00' + millisecond : millisecond;
  millisecond = millisecond < 100 ? '0' + millisecond : millisecond;
  res = res.replace('SSS', millisecond);
  return res;
};
