const sha256 = require("sha256");
const {v4: uuidv4} = require("uuid");

function Blockchain() {
  this.chain = [];
  this.newTransactions = [];
  this.networkNodes = [];
  this.createNewBlock(1000, "0", "0");
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
    transactionId:uuidv4().replaceAll("-", "")
  };
  return newTransaction;
};
Blockchain.prototype.addTransaction=function (transaction){
  this.newTransactions.push(transaction);
  return this.getLastBlock() + 1;
}
Blockchain.prototype.hashBlock = function (
  previousBlockHash,
  currentBlockData,
  nonce
) {
  return sha256(
    previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData)
  );
};

Blockchain.prototype.proofOfWork = function (
  previousBlockHash,
  currentBlockData
) {
  for (i = 0; ; i++) {
    if (
      this.hashBlock(previousBlockHash, currentBlockData, i).startsWith("0000")
    )
      return i;
  }
};

module.exports = Blockchain;
