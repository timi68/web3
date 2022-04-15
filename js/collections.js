!(function (j) {
  "use-strict";
  var currentUser = null;
  var account = null;

  try {
    currentUser = Moralis.User.current();
  } catch (error) {
    console.log({ error });
  }

  async function init() {
    let hello = await Moralis.Cloud.run("helloWorld");
    console.log({ currentUser, account, hello });
    if (!currentUser) {
      const connect = confirm(
        "You need to connect wallet, click Ok to onnect wallet"
      );

      if (connect) {
        j(".backdrop").addClass("active");
        try {
          currentUser = await Moralis.authenticate();
          account = currentUser.get("ethAddress");
          console.log({ account });
        } catch (error) {
          console.log(error.message);
        }
      }

      const network_options = j(".network-option");
      const network_active = j(".network-active");

      console.log({ network_active, network_options });
      network_options.each((index, element) => {
        var text = j(element).text();
        j(element).on("click", () => network_active.text(text));
      });

      j(".backdrop").removeClass("active");
    } else account = currentUser.get("ethAddress");

    return;
  }
  init();

  j("#add_btn").on("click", async () => {
    var token_address = j("#address").val();
    if (!token_address) return alert("No contract address specified");

    console.log({ token_address });
    if (!currentUser) {
      const initiate_connect = await init();
      if (!initiate_connect) return;
    }

    let options = {
      chain: "rinkeby",
      token_address,
      address: account,
    };

    j(".backdrop").addClass("active");

    try {
      const contractNFTs = await Moralis.Web3API.account.getNFTsForContract(
        options
      );

      console.log({ options, contractNFTs });
    } catch (error) {
      alert(error.message);
    }

    j(".backdrop").removeClass("active");

    // const Collections = Moralis.object.extend("NFTsCollections");

    // const collection = new Collections();

    // console.log({collection})
  });
})(jQuery);
