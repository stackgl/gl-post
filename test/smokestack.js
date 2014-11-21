require('./index')
require('tape')('shutdown', function(t) {
  t.end()
  setTimeout(function(){window.close()})
})
