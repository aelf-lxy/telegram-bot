const AElf = require('aelf-sdk');
const { getTxResult } =require('@portkey/contracts');

function getAElf(rpcUrl) {
  const rpc = rpcUrl || '';
  const httpProviders = {};

  if (!httpProviders[rpc]) {
    httpProviders[rpc] = new AElf(new AElf.providers.HttpProvider(rpc));
  }
  return httpProviders[rpc];
}

const getRpcUrls = () => {
  return {
    AELF: 'https://aelf-test-node.aelf.io',
    tDVV: 'https://tdvv-test-node.aelf.io',
    tDVW: 'https://tdvw-test-node.aelf.io',
  };
};

async function getTxRs(TransactionId, chainId = 'tDVW', reGetCount = -280, notExistedReGetCount = -5) {
  const rpcUrl = getRpcUrls()[chainId];
  const instance = getAElf(rpcUrl);
  const txResult = await getTxResult(instance, TransactionId, reGetCount, notExistedReGetCount);
  console.log('TransactionId-----------',TransactionId, txResult)
  if (txResult.Status.toLowerCase() === 'mined') {
    return txResult;
  }
  throw Error('Transaction error:' + TransactionId);
}

module.exports = getTxRs
