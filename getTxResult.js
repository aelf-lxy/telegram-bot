const AElf  =  require('aelf-sdk');
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
    AELF: 'https://aelf-public-node.aelf.io',
    tDVV: 'https://tdvv-node.eforest.finance',
    tDVW: 'https://tdvv-node.eforest.finance',
  };
};

async function getTxRs(TransactionId, chainId = 'tDVW', reGetCount = -280) {
  const rpcUrl = getRpcUrls()[chainId];
  const instance = getAElf(rpcUrl);
  const txResult = await getTxResult(instance, TransactionId, reGetCount);
//   if (txResult.Status.toLowerCase() === 'mined') {
//     return txResult;
//   }
//   throw Error({ ...txResult.Error, TransactionId } || 'Transaction error');
  return txResult.Status.toLowerCase();
}

module.exports = getTxRs
