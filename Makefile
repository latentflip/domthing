PATH := node_modules/.bin:$(PATH)

.PHONY: test
.PHONY: force

all: lib/sexp-parser.js runtime.bundle.js demo/templates.js

runtime.bundle.js: force
	browserify runtime.js -s RUNTIME > runtime.bundle.js

demo/templates.js: force
	./bin/domthing --no-runtime demo/templates > demo/templates.js

serve-demo: force
	beefy demo/demo.js --open

test: runtime.bundle.js
	faucet

lib/sexp-parser.js: lib/sexp-parser.pegjs
	./node_modules/.bin/pegjs lib/sexp-parser.pegjs
