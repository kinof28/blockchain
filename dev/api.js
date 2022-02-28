const express = require("express");
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");
const { v4: uuidv4 } = require("uuid");
const etherium = new Blockchain();
const app = express();
const nodeAdress = uuidv4().replaceAll("-", "");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Testing End point
app.get("/", function (req, res) {
  //   res.send("Blockchain Api Works , Test succeed !!");
  res.send(`this node adress is ${nodeAdress}`);
});
// end point to get the hole blockchain
app.get("/blockchain", function (req, res) {
  res.send(etherium);
});
//end point to create a transaction
app.post("/newTransaction", function (req, res) {
  etherium.createNewTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );
  res.send("transaction created succeffuly");
});
//endpoint to mine
app.get("/mine", function (req, res) {
  const previousBlockHash = etherium.getLastBlock().hash;
  const currentBlockData = {
    index: etherium.getLastBlock().index,
    transactions: etherium.newTransactions,
  };
  const nonce = etherium.proofOfWork(previousBlockHash, currentBlockData);
  const hash = etherium.hashBlock(previousBlockHash, currentBlockData, nonce);
  const block = etherium.createNewBlock(nonce, previousBlockHash, hash);
  etherium.createNewTransaction(6.25, "0X0", nodeAdress);
  res.json({
    note: `you mined block with index ${block.index} with hash ${block.hash}`,
    block,
  });
});

app.listen(3000, function () {
  console.log("Listenin on port 3000 ....");
});
