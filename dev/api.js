const port = process.argv[2];
const express = require("express");
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");
const { v4: uuidv4 } = require("uuid");
const etherium = new Blockchain();
const app = express();
const nodeAddress = uuidv4().replaceAll("-", "");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Testing End point
app.get("/", function (req, res) {
  //   res.send("Blockchain Api Works , Test succeed !!");
  res.send(`this node address is ${nodeAddress}`);
});
// end point to get the hole blockchain
app.get("/blockchain", function (req, res) {
  res.send(etherium);
});
//end point to create a transaction
app.post("/new-transaction", function (req, res) {
  etherium.createNewTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );
  res.send("transaction created successfully");
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
  etherium.createNewTransaction(6.25, "0X0", nodeAddress);
  res.json({
    note: `you mined block with index ${block.index} with hash ${block.hash}`,
    block,
  });
});

//end point of entry point to add a new node ,so we add and broadcast it to the network
app.post("/add-and-broadcast-node", function (req, res) {});

// end point to add an end point
app.post("/add-node", function (req, res) {});

// end point to add the existing network to the new node ,so we bulk add nodes
app.post("add-bulk", function (req, res) {});

// Start the App
app.listen(port, function () {
  console.log(`Listening on port ${port} .....`);
  console.log(process.argv);
});
