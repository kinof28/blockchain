function Blockchain() {
  this.chain = [];
  this.newTransactions = [];
}
Blockchain.prototype.createNewBlock = function (
  nonce,
  previousBlockHash,
  hash
) {
  const newBlock = {
    index: this.chain.length + 1,
    timeStamp: Date.now(),
    transactions: this.newTransactions,
    nonce: nonce,
    previousBlockHash: previousBlockHash,
    hash: hash,
  };
  this.newTransactions = [];
  this.chain.push(newBlock);
  return newBlock;
};
Blockchain.prototype.getLastBlock = function () {
  return this.chain[this.chain.length - 1];
};
Blockchain.prototype.createNewTransaction = function (
  amount,
  sender,
  recipient
) {
  const newTransaction = {
    amount,
    sender,
    recipient,
  };
  this.newTransactions.push(newTransaction);
  return this.getLastBlock() + 1;
};

module.exports = Blockchain;
