Rule ID: R01 ownable-unauthorized-revert-string-chai
Kind: deterministic-rewrite
Variant: canonical chai await form
Expected: Rewrites to revertedWithCustomError with contract handle inferred from promise, omitting withArgs.