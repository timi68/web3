"use-strict";
var currentUser,
  account,
  web3,
  chainId,
  ep = $("#network-chain");

// connect wallet
async function init() {
  try {
    // enabling web3
    // await Moralis.enableWeb3();
    // console.log("Enabled", Moralis.isWeb3Enabled());

    currentUser = await Moralis.authenticate();
    account = currentUser.get("ethAddress");

    web3 = new Web3(ethereum);
    window.web3 = web3;

    showNetwork();

    if (window.ethereum) {
      // detect Metamask account change
      window.ethereum.on("accountsChanged", function (accounts) {
        account = accounts[0];
        addCurrentChain();
      });

      // detect Network account change
      window.ethereum.on("chainChanged", addCurrentChain);
    }

    return true;
  } catch (error) {
    alert("Error: " + error.message);
    console.log({ error });

    return false;
  }
}

// function to send transaction to an account
async function sendTransaction() {
  var receiver = $("#receiver").val();
  var amount = $("#amount").val();
  var description = $("#description").val();
  var keyword = $("#keyword").val();

  console.log({ receiver, amount, description, keyword });
  if (!receiver || !amount) return alert("Receiver and Amount is required");

  $(".backdrop").addClass("active");

  let options = {
    method: "eth_sendTransaction",
    params: [
      {
        from: account,
        gas: "21000",
        to: receiver,
        value: Moralis.Units.ETH(amount),
        chainId,
      },
    ],
  };

  const transaction = await ethereum.request(options);

  console.log({ transaction });
  $(".hash").text(transaction);
  $(".modal-toggle").trigger("click");

  $(".backdrop").removeClass("active");

  $("#receiver").val(""), $("#amount").val("");
}

// function to change metamask wallet network
async function changeNetwork(key, name) {
  try {
    await Moralis.switchNetwork(key);
    return true;
  } catch (error) {
    alert(
      "You don't have the network in your wallet: Features to change coming soon"
    );
    return false;
  }
}

const chains = [
  {
    key: "0x1",
    value: "Ethereum",
  },
  {
    key: "0x539",
    value: "Local Chain",
  },
  {
    key: "0x3",
    value: "Ropsten Testnet",
  },
  {
    key: "0x4",
    value: "Rinkeby Testnet",
  },
  {
    key: "0x2a",
    value: "Kovan Testnet",
  },
  {
    key: "0x5",
    value: "Goerli Testnet",
  },
  {
    key: "0x38",
    value: "Binance",
  },
  {
    key: "0x61",
    value: "Smart Chain Testnet",
  },
  {
    key: "0x89",
    value: "Polygon",
  },
  {
    key: "0x13881",
    value: "Mumbai",
  },
  {
    key: "0xa86a",
    value: "Avalanche",
  },
  {
    key: "0xa869",
    value: "Avalanche Testnet",
  },
];

async function showNetwork() {
  const dropdown = $("<div>", {
    class: "dropdown-menu p-2 text-secondary mt-1 rounded-15 shadow-lg",
  }).css({ left: "initial", right: 0 });

  var chainsHtml = [];
  addCurrentChain();

  chains.map((chain) => {
    let template = $("<div>", {
      class: "chain-option mb-1 dropdown-item text-truncate",
    })
      .data("key", chain.key)
      .text(chain.value)
      .on("click", async function () {
        console.log({ key: $(this).data("key") });
        const changed = await changeNetwork(chain.key, chain.value);

        if (!changed) return;
        ep.data("chain", chain.key).text(chain.value);
      });

    chainsHtml.push(template);
  });

  $(".dropdown").append(dropdown.append(chainsHtml)).removeClass("d-none");
}

async function addCurrentChain(chainId) {
  chainId = chainId ?? (await Moralis.chainId);
  var currentChain = chains.filter((chain) => chain.key === chainId)[0];

  // display current account network
  ep.text(currentChain.value).data("key", currentChain.key);
  $(".current-chain").text(currentChain.value);

  let options = {
    chain: chainId,
    address: account,
  };

  const { balance } = await Moralis.Web3API.account.getNativeBalance(options);
  const result = web3.utils.fromWei(balance, "ether");

  $(".balance").text(parseFloat(result).toFixed(4));
  $(".address").text(account);
}

$("#transfer").on("click", sendTransaction);
init();
