lint:
	@./node_modules/.bin/eslint .

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--harmony \
		--reporter spec \
		--require should \
		*/test.js

trace:
	@node \
		--trace-hydrogen \
		--trace-phase=Z \
		--trace-deopt \
		--code-comments \
		--hydrogen-track-positions \
		--redirect-code-traces \
		--redirect-code-traces-to=code.asm \
		--print-opt-code \
		./app/modules/displacements/performanceBenchmark.js

.PHONY: lint test