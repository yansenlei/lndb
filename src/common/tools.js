function replaseId(id, rep){
  return String(id).replace(/[/|\\]/g, rep).trim()
}

function isBase64(v, opts) {
  // https://github.com/miguelmota/is-base64
  if (v instanceof Boolean || typeof v === 'boolean') {
    return false
  }
  if (!(opts instanceof Object)) {
    opts = {}
  }
  if (opts.hasOwnProperty('allowBlank') && !opts.allowBlank && v === '') {
    return false
  }

  var regex = /^(data:\w+\/[a-zA-Z\+\-\.]+;base64,)?(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/gi;

  if (opts.paddingRequired === false) {
    regex = /^(data:\w+\/[a-zA-Z\+\-\.]+;base64,)?(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}(==)?|[A-Za-z0-9+\/]{3}=?)?$/gi;
  }

  return regex.test(v);
}

module.exports = {
  replaseId,
  isBase64
}