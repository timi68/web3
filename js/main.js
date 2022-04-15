class NFT {
  /**
   *
   * @param {string} query
   * @param {string} [chain] this is the chain to base search on
   * @param {string} [filter] how to filter the search
   */
  static async searchNFT(query, chain, filter) {
    const options = { q: query, chain, filter };
    const NFTs = await Moralis.Web3API.token.searchNFTs(options);

    return NFTs;
  }
}

const initialize = new NFT();

!(function (j) {
  /**
   *
   * @param {string} query
   * @param {string} [chain] this is the chain to base search on
   * @param {string} [filter] how to filter the search
   */
  async function searchNFT(query, chain = "", filter = "") {
    const search = await NFT.searchNFT(query, chain, filter);

    j("#search-count").html(search.page_size);
    var result = search.result;
    var domElement = [];

    // console.log({ metaData: JSON.parse(result[0].metadata) });
    j(".card-wrapper").html("");
    result.splice(0, 10).forEach((token) => {
      var metadata = JSON.parse(token.metadata);
      const html = `
      <div class="card-body">
        <div class="card-media">
          <img src="${metadata.image_url}" alt="token image" />
        </div>
        <div class="card-content">
          <div class="nft-name">
            <span class="label" role="label">
              Name
            </span>
            <span class="text">${metadata.name}</span>
          </div>
          <div class="nft-owner">
            <span class="label" role="label">
              Owner:
            </span>
            <span class="text">${metadata.owner.address}</span>
          </div>
          <div class="nft-desc">
            <span class="label" role="label">
              Description
            </span>
            <span class="text">${metadata.description}</span>
          </div>
          <div class="contract-type">
            <span class="label">Contract-type</span>
            <span class="text">${token.contract_type}</span>
          </div>
          <div class="token_address">
            <span class="label">Token Address</span>
            <span class="text">${token.token_address}</span>
          </div>
          <div class="created_at">
            <span class="label" role="label">
              Created_At
            </span>
            <span class="text">${metadata.created_at}</span>
          </div>
        </div>
      </div>`;

      const card = j("<div>", { class: "card" }).html(html);

      j(".card-wrapper").append(card);
    });

    console.log({ result });
  }

  searchNFT("Pancake");
  j("#search-btn").on("click", function () {
    let query = j("#search-query").val();

    if (query) {
      searchNFT(query);
    }
  });
})(jQuery);
