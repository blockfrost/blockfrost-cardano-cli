# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Support for Preview and Preprod Cardano networks via `--testnet-magic` option. Project ID for these networks is picked from environment variables `BLOCKFROST_PROJECT_ID_PREPROD` and `BLOCKFROST_PROJECT_ID_PREVIEW`.
- Report `cost_models` in protocol-parameters command
- Fallback to cardano-cli for commands not supported by blockfrost-cardano-cli.

### Changed

- Upgraded dependencies

## [0.0.2]

### Added

- dummy `--mainnet` flag to improve compatibility with cardano-cli

## [0.0.1]

### Added

- initial release
