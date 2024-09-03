
run:
	pnpm node --loader ts-node/esm ./src/main.ts

bun-run:
	bun ./src/main.ts

bun-run-%:
	bun ./src/${*}.ts

tsx-run-%:
	pnpm tsx ./src/${*}.ts

run-%:
	pnpm node --loader ts-node/esm ./src/${*}.ts

fmt: ## format code
	pnpm prettier --cache --cache-strategy metadata --write ./src package.json $(wildcard *.ts postcss.config.* tailwind.config.* next.config.*)
