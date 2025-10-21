# Formatting

The generated JSON files can be formatted with [jq](https://jqlang.org/).

For example, to format the result of the [parse-county-fips](./src/parse-county-fips.js) script:

```sh
jq . county-fips.json > county-fips-formatted.json
```
