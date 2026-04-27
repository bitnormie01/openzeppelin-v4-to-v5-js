// TODO(oz-v5): _beforeTokenTransfer / _afterTokenTransfer hooks are removed in v5.
// Use _update instead. ERC721 _update has no `from` arg.
// We override _beforeTokenTransfer here
// TODO(oz-v5): _beforeTokenTransfer / _afterTokenTransfer hooks are removed in v5.
// Use _update instead. ERC721 _update has no `from` arg.
it("calls _beforeTokenTransfer", async () => {
    // TODO(oz-v5): _beforeTokenTransfer / _afterTokenTransfer hooks are removed in v5.
// Use _update instead. ERC721 _update has no `from` arg.
    await mock.callStatic._beforeTokenTransfer();
});
