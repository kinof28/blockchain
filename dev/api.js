const port = process.argv[2];
const url = process.argv[3];
const express = require("express");
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");
const {v4: uuidv4} = require("uuid");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const etherium = new Blockchain();
const app = express();
const nodeAddress = uuidv4().replaceAll("-", "");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Testing End point
app.get("/", function (req, res) {
    //   res.send("Blockchain Api Works , Test succeed !!");
    res.send(`this node address is ${nodeAddress}`);
});
// end point to get the hole blockchain
app.get("/blockchain", function (req, res) {
    res.send(etherium);
});
//end point to create a transaction and broadcast it
app.post("/create-transaction-and-broadcast", function (req, res) {
    const transaction = etherium.createNewTransaction(
        req.body.amount,
        req.body.sender,
        req.body.recipient
    );
    etherium.addTransaction(transaction);
    const promises = [];
    etherium.networkNodes.forEach(nodeUrl => {
        promises.push(fetch(`${nodeUrl}/add-transaction`, {
            method: "post",
            body: JSON.stringify({
                transaction: transaction
            }),
            headers: {'Content-Type': 'application/json'}
        }));
    })
    Promise.all(promises).then(() => {
        res.send("transaction created successfully");
    })
});
//end point to add transaction from a broadcast
app.post("/add-transaction", function (req, res) {
    etherium.addTransaction(req.body.transaction);
    res.send("transaction added successfully");
})
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
    const transaction = etherium.createNewTransaction(6.25, "0X0", nodeAddress);
    etherium.addTransaction(transaction);
    const promises = [];
    etherium.networkNodes.forEach(nodeUrl => {
        promises.push(fetch(`${nodeUrl}/add-block`, {
            method: "post",
            body: JSON.stringify({
                block
            }),
            headers: {'Content-Type': 'application/json'}
        }).then(function () {
            fetch(`${nodeUrl}/add-transaction`, {
                method: "post",
                body: JSON.stringify({
                    transaction
                }),
                headers: {'Content-Type': 'application/json'}
            })
        }))
    });
    Promise.all(promises).then(function () {
        res.json({
            note: `you mined block with index ${block.index} with hash ${block.hash}`,
            block,
        });
    });
});

//end point to add new block in blockchain after get mined
app.post("/add-block", function (req, res) {
    const block = req.body.block;
    const lastBlock = etherium.getLastBlock();
    if (block.previousBlockHash === lastBlock.hash && block.index === (lastBlock.index + 1)) {
        etherium.createNewBlock(block.nonce, block.previousBlockHash, block.hash);
        res.send("block added successfully");
    }else {
        res.send("block was not added something went wrong ");
    }
})

//end point of entry point to add a new node ,so we add and broadcast it to the network
app.post("/add-and-broadcast-node", function (req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    // console.log("the new node requested to be added : "+newNodeUrl);
    let body;
    const promises = [];
    if (newNodeUrl !== url && etherium.networkNodes.indexOf(newNodeUrl) < 0) {
        body = {
            "nodeUrl": newNodeUrl
        }
        etherium.networkNodes.forEach(nodeUrl => {

            promises.push(fetch(`${nodeUrl}/add-node`, {
                method: 'post',
                body: JSON.stringify(body),
                headers: {'Content-Type': 'application/json'}
            }));
        });

        Promise.all(promises).then(function () {
            //TODO: add bulk
            body = {
                "nodes": [url, ...etherium.networkNodes]
            }
            fetch(`${newNodeUrl}/add-bulk`, {
                method: 'post',
                body: JSON.stringify(body),
                headers: {'Content-Type': 'application/json'}
            }).then(function () {
                res.json({
                    'note': "node added successfully",
                    'added-node': newNodeUrl,
                    'new-blockchain-nodes': etherium.networkNodes
                });
            });

        });
        etherium.networkNodes.push(newNodeUrl);

    } else {
        res.json({
            'note': "something went wrong",
            'added-node': newNodeUrl,
            'new-blockchain-nodes': etherium.networkNodes
        });
    }
});

// end point to add an end point
app.post("/add-node", function (req, res) {
    const newNodeUrl = req.body.nodeUrl;
    if (newNodeUrl !== url && etherium.networkNodes.indexOf(newNodeUrl) < 0) {
        etherium.networkNodes.push(newNodeUrl);
        res.json({
            'note': "node added successfully",
            'added-node': newNodeUrl,
            'new-blockchain-nodes': etherium.networkNodes
        });
    } else {
        res.json({
            'note': "node already exists",
            'added-node': newNodeUrl,
            'new-blockchain-nodes': etherium.networkNodes
        });
    }
});

// end point to add the existing network to the new node ,so we bulk add nodes
app.post("/add-bulk", function (req, res) {
    const nodes = req.body.nodes;
    if (nodes.length > 0) {
        nodes.forEach(node => {
            if (node !== url && etherium.networkNodes.indexOf(node) < 0) {
                etherium.networkNodes.push(node);
            }
        })
    }
    res.send("ok");
});

// Start the App
app.listen(port, function () {
    console.log(`Listening on port ${port} .....`);
    console.log(process.argv);
});
