.PHONY: test
.PHONY: force

runtime.bundle.js: force
	@./node_modules/.bin/browserify runtime.js -s RUNTIME > runtime.bundle.js

templates.js: force
	@./bin/domthing templates


test: runtime.bundle.js
	faucet


