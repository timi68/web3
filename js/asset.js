"use-strict";
var web3;
var accounts;
var contractAddress = "0xb703ca398f5a7bcf6add7de0fd5647ccf158f62a";

async function initialize() {
  await Moralis.enableWeb3();
  web3 = new Web3(Moralis.provider);

  accounts = await web3.eth.getAccounts();
}

!(function (j) {
  "use-strict";

  j(document).ready(async () => {
    const Collections = Moralis.Object.extend("NFTCollections");
    var Query = new Moralis.Query(Collections);
    var params = new URLSearchParams(location.search);

    console.log({ Query, params });
    try {
      const a = params.get("address");
      var token = params.get("token");

      if (!a) location.href = "/error/";

      const e = await Query.equalTo("contractAddress", a).find();
      window.contract = e[0];

      if (!e?.length) {
        let html = ` <div class="text-center h4 font-weight-normal p-5">contract Not found</div>`;
        j(".card-wrapper").html(html);

        return false;
      }

      await initialize();

      var options = {
        address: contractAddress,
        chain: "ropsten",
      };

      var Owners = await Moralis.Web3API.token.getNFTOwners(options);

      var tokensOwner = {};
      Owners.result.map((token) => {
        tokensOwner[token.token_id] = (tokensOwner[token.token_id] ?? 0) + 1;
      });

      console.log({ tokensOwner });

      j(".card-wrapper").html("");
      const n = e[0].get("nfts");
      n.forEach((token, index) => {
        var metadata = JSON.parse(token.metadata);

        const html = `
        <div class="card-media">
              <img src="${
                metadata.image
              }" class="rounded-50 d-block mx-auto p-3" alt="token image" />
            </div>
          <div class="card-body">
            <div class="card-content">
             token id : ${token.token_id}            
             <br>
             No in circulation: ${token.amount}
            <br>
            No of owners: ${tokensOwner[token.token_id]}
              <div class="nft-name">
                <span class="label small" role="label">
                  Name
                </span>
                <span class="text p">${metadata.name}</span>
              </div>
              <div class="nft-desc">
                <span class="label small" role="label">
                  Description
                </span>
                <span class="text p">${metadata.description}</span>
              </div>
            </div>
            <div class="card-actions d-flex mt-3">
              <button class="btn btn-primary rounded-50 mr-2 flex-grow-1" id="mint${index}">Mint</button>
              <button class="btn btn-primary rounded-50 flex-grow-1" id="transfer${index}">Transfer</button>
            </div>
          </div>
           `;

        const card = j("<div>", { class: "card p-0" }).html(html);
        card.prependTo(".card-wrapper");
        j(`#mint${index}`).on("click", () =>
          mint(token.token_id, metadata.name)
        );
        j(`#transfer${index}`).on("click", () =>
          transfer(token.token_id, metadata.name)
        );
      });

      j(".card-wrapper").removeClass("loading");
    } catch (error) {
      console.log({ error: error.message });
    }
  });

  function mint(tokenID, tokenName) {
    j("#open-modal").trigger("click");
    j("#address").val(accounts[0]);
    j("#tokenId").val(tokenID);
    j("#mintModalLabel").text("Mint : " + tokenName);
    j("#mint_finish").off("click").on("click", finishProcess);

    function finishProcess() {
      j(".backdrop").addClass("active");

      try {
        console.log({ address, tokenID, accounts });
        var amount = j("#amount").val();

        if (!accounts?.length || !tokenID || !amount) {
          throw Error("Some fields are empty");
        }

        const contract = new web3.eth.Contract(contractAbi, contractAddress);
        contract.methods
          .mint(accounts[0], tokenID, amount)
          .send({ from: accounts[0], value: 0 })
          .on("receipt", (receipt) => {
            console.log({ receipt });
          });
      } catch (error) {
        console.log({ error });
      }

      j(".backdrop").removeClass("active");
    }
  }

  function transfer(tokenId, tokenName) {
    j("#open-transfer-modal").trigger("click");
    j("#transfer_tokenId").val(tokenId);
    j("#transferModalLabel").text("Transfer: " + tokenName);
    j("#transfer_finish").off("click").on("click", processTransfer);

    async function processTransfer() {
      j(".backdrop").addClass("active");
      var receiver = j("#receiver_address").val();
      var amount = j("#transfer_amount").val();
      console.log({ receiver, amount });

      // sending 15 tokens with token id = 1
      try {
        const options = {
          type: "erc1155",
          receiver,
          contractAddress,
          tokenId,
          amount,
        };

        let transaction = await Moralis.transfer(options);
        console.log({ transaction });
      } catch (error) {
        console.log({ error });
      }
      j(".backdrop").removeClass("active");
    }
  }
})(jQuery);
