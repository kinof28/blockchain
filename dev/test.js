const Blockchain = require("./blockchain");

const etherium = new Blockchain();
// etherium.createNewBlock(
//   1234,
//   "IUYHFDS75754SDF54SD54FS5D4",
//   "54141FSDFSDF45SD12FS"
// );
// etherium.createNewTransaction(10, "MEOJHSE1545F4E", "YOU275SDFDFS");
// etherium.createNewTransaction(140, "MEOJHSE1545F4E", "YOU275SDFDFS");

// etherium.createNewBlock(
//   2235,
//   "IUYHFDS75754SDF54SD54FS5D4",
//   "54141FSDFSDF45SD12FS"
// );
// etherium.createNewTransaction(105, "MEOJHSE1545F4E", "YOU275SDFDFS");
// etherium.createNewBlock(
//   8743,
//   "IUYHFDS75754SDF54SD54FS5D4",
//   "54141FSDFSDF45SD12FS"
// );
// etherium.createNewTransaction(106, "OJHSE1545F4E", "PSDF275SDFDFS");
console.log(
  etherium.hashBlock(
    "54SD5F41SQDG54QSD64GQSD54GQS",
    [
      { amount: 10, sender: "MEOJHSE1545F4E", recepient: "YOU275SDFDFS" },
      { amount: 10, sender: "MEOJHSE1545F4E", recepient: "YOU275SDFDFS" },
      { amount: 10, sender: "MEOJHSE1545F4E", recepient: "YOU275SDFDFS" },
    ],
    16091
  )
);
