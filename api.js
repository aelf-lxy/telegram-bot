const { service } = require("./server");

function faucetsToken (data) {
  return service.post('/app/faucets/transfer', data, {
      headers: { 'content-type': 'application/json' }
  })
}

module.exports = {
  faucetsToken,
};
