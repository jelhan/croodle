/* global moment */

export default function(date, options) {
  var times = options.hash.times ? options.hash.times : false,
      format = options.hash.format ? options.hash.format : 'LLLL';
  if (times === true) {
    return moment(date).format( format );
  }
  else {
    return moment(date).format(moment.localeData().longDateFormat( format ).replace('LT' , ''));
  }
}