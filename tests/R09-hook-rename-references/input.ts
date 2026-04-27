// We override _beforeTokenTransfer here
it("calls _beforeTokenTransfer", async () => {
    await mock.callStatic._beforeTokenTransfer();
});
