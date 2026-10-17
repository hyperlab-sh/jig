# Changelog

## 6.1.0 (unreleased)

### Features

- **Indent tracking**: Added `indent: number` field to `RuntimeTag` and `TagToken` types. The `indent` value captures the number of leading whitespace characters before each tag, enabling downstream consumers (parser, compiler) to implement implicit indentation control for block tag content and includes.
