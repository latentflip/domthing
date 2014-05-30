.PHONY: test
.PHONY: force

all: runtime.bundle.js templates.js serve-demo

ampersand: runtime.bundle.js templates.js serve-ampersand-demo

runtime.bundle.js: force
	./node_modules/.bin/browserify runtime.js -s RUNTIME > runtime.bundle.js

templates.js: force
	./bin/domthing templates

serve-demo: force
	beefy demo.js --open

serve-ampersand-demo: force
	beefy switch.js --cwd ./ampersand-demo --open

test: runtime.bundle.js
	faucet
