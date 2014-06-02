PATH := node_modules/.bin:$(PATH)

.PHONY: test
.PHONY: force

all: runtime.bundle.js demo/templates.js serve-demo

runtime.bundle.js: force
	browserify runtime.js -s RUNTIME > runtime.bundle.js

demo/templates.js: force
	./bin/domthing demo/templates > demo/templates.js

serve-demo: force
	beefy demo/demo.js --open

test: runtime.bundle.js
	faucet
