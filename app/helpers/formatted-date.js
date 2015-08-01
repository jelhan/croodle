/* global moment */

export default function(date, options) {
  if (options === undefined) {
    options = {};
  }
  if (options.hash === undefined) {
    options.hash = {};
  }
  
  var times = options.hash.times ? options.hash.times : false,
      format = options.hash.format ? options.hash.format : 'LLLL';
  if (times === true) {
    return moment(date).format( format );
  }
  else {
    return moment(date).format(
      moment.localeData().longDateFormat('LLLL')
      .replace(
        moment.localeData().longDateFormat('LT'), '')
      .trim()
    );
  }
}
