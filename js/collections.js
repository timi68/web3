// @ts-check;

!(function (j) {
  "use-strict";

  j("#add_btn").on("click", async () => {
    var token_address = j("#address").val();
    var chain = j("#network-chain").data("chain") ?? "ropsten";

    if (!token_address) return alert("No contract address specified");
    let options = {
      chain, // default chain to "ropsten"
      address: token_address,
    };

    j(".backdrop").addClass("active");

    try {
      const contractNFTs = await Moralis.Web3API.token.getAllTokenIds(options);

      if (contractNFTs.result?.length) {
        const Collections = Moralis.Object.extend("NFTCollections");

        // check if contract doesn't exist
        let query = new Moralis.Query(Collections);
        let exist = await query
          .equalTo("contractAddress", token_address)
          .find();

        console.log({ exist });

        if (exist?.length) {
          let goStore = confirm(
            token_address.concat(" already in store, go to store?")
          );
          console.log({ goStore });
          if (goStore)
            return (location.href = `/collections/asset/?address=${token_address}`);
        } else {
          const collection = new Collections();

          collection.set("owner", contractNFTs.owner ?? null);
          collection.set("nfts", contractNFTs.result);
          collection.set("contractAddress", token_address);

          await collection.save();
          location.href = `/collections/asset/?address=${token_address}`;
        }
      }
    } catch (error) {
      alert(error.message);
    }

    j(".backdrop").removeClass("active");
  });
  j(".network-option").each((i, e) => {
    var el = j(e),
      ep = j("#network-chain");
    el.on("click", (ev) => {
      ep.data("chain", el.data("name")).text(el.data("name"));
    });
  });
})(jQuery);
