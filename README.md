# Blockfrost Cardano CLI

Drop-in(ish) replacement for cardano-cli. Query the blockchain without the need to spin up your own Cardano node. All powered by [Blockfrost API](https://blockfrost.io).

## Installation

### npm

If you have Node.js installed the fastest way to install the CLI is directly with npm. For instructions for installing Node.js please see [nodejs.org](https://nodejs.org/en/download/). Although the CLI should run on Node.js v14 just fine, we recommend v16 which is active LTS.

```console
npm install -g @blockfrost/blockfrost-cardano-cli
```

After the installation is completed new commands `blockfrost-cardano-cli` and its shorter alias `bcc` should be available.

### Docker

Build the docker container by running following command within the repository:

```console
docker build . -t blockfrost-cardano-cli --no-cache
```

Then run `docker run` with `--env` flag to pass environment variables into a docker container:

```console
docker run --env BLOCKFROST_PROJECT_ID_MAINNET=<PROJECT_ID> blockfrost-cardano-cli --help
```

## Setup

In order to use Blockfrost Cardano CLI you first need generate project token(s) on [Blockfrost.io](https://blockfrost.io).

Then set following environment variables:

- `BLOCKFROST_PROJECT_ID_MAINNET` - Mainnet token that will be used if you don't specify `--testnet` flag
- `BLOCKFROST_PROJECT_ID_TESTNET` - Testnet token that will be used when `--testnet` flag is specified

We recommend setting both of these variables as it allows you to seamlessly switch between mainnet and testnet network while using the CLI.

## Usage

```console
$ bcc <COMMAND> [--testnet | --testnet-magic 1097911063] [--out-file FILE] [--help]
```

### Commands

#### `bcc query pool-params --stake-pool-id POOLID`

List parameters of specified pool

```console
$ bcc query pool-params --stake-pool-id pool1y6chk7x7fup4ms9leesdr57r4qy9cwxuee0msan72x976a6u0nc --testnet

{
    "poolParams": {
        "publicKey": "26b17b78de4f035dc0bfce60d1d3c3a8085c38dcce5fb8767e518bed",
        "cost": 340000000,
        "metadata": {
            "hash": "514e56dacc4f556ebc1d307473d0cf15d4cf0dc27169870e46a811625f09262e",
            "url": "https://stakenuts.com/testnet.json"
        },
        "vrf": "db61b20aeb616dbc39ca36194e7a54d5cef5464c6e6d0d420cfa551f7dc43d64",
        "owners": [
            "13cf55d175ea848b87deb3e914febd7e028e2bf6534475d52fb9c3d0"
        ],
        "pledge": 100000000000,
        "rewardAccount": {
            "network": "Testnet",
            "credential": {
                "key hash": "13cf55d175ea848b87deb3e914febd7e028e2bf6534475d52fb9c3d0"
            }
        },
        "margin": 0.05,
        "relays": [
            {
                "single host name": {
                    "port": 3001,
                    "dnsName": "relays.testnet.stakenuts.com"
                }
            }
        ]
    },
    "futurePoolParams": null,
    "retiring": null
}
```

#### `bcc query protocol-parameters`

```console
$ bcc query protocol-parameters --testnet

{
    "txFeePerByte": 44,
    "minUTxOValue": 34482,
    "decentralization": 0,
    "utxoCostPerWord": 34482,
    "stakePoolDeposit": 500000000,
    "poolRetireMaxEpoch": 18,
    "extraPraosEntropy": null,
    "collateralPercentage": 150,
    "stakePoolTargetNum": 500,
    "maxBlockBodySize": 73728,
    "minPoolCost": 340000000,
    "maxTxSize": 16384,
    "treasuryCut": 0.2,
    "maxBlockExecutionUnits": {
        "memory": 50000000,
        "steps": 40000000000
    },
    "maxCollateralInputs": 3,
    "maxValueSize": 5000,
    "maxBlockHeaderSize": 1100,
    "maxTxExecutionUnits": {
        "memory": 11250000,
        "steps": 10000000000
    },
    "costModels": {},
    "protocolVersion": {
        "minor": 0,
        "major": 6
    },
    "txFeeFixed": 155381,
    "stakeAddressDeposit": 2000000,
    "monetaryExpansion": 0.003,
    "poolPledgeInfluence": 0.3,
    "executionUnitPrices": {
        "priceSteps": 0.0000721,
        "priceMemory": 0.0577
    }
}
```

#### `bcc query tip`

Get the current tip

```console
$ bcc query tip --testnet

{
    "epoch": 171,
    "hash": "d91bbfb72158eed4949663abbc20ce70dcc1a5c4d8855b6db46f6cd9c061dce5",
    "slot": 43922944,
    "block": 3115492,
    "era": "Alonzo",
    "syncProgress": "100.00"
}
```

#### `bcc query stake-distribution`

List of pools sorted by pool ID (in hex).

```console
$ bcc query stake-distribution --testnet

 PoolId                                                   Stake frac
 ──────────────────────────────────────────────────────── ──────────
 pool1qqyjr9pcrv97gwrueunug829fs5znw6p2wxft3fvqkgu5f4qlrg 6.246e-3
 pool1qqfnw2fwajdnam7xsqhhrje5cgd8jcltzfrx655rd23eqlxjfef 2.983e-6
 pool1qquwwu6680fr72y4779r2kpc7mxtch8rp2uhuqcc7v9p6q4f7ph 2.178e-7
 pool1qptl80vq84xm28pt3t2lhpfzqag28csjhktxz5k6a74n260clmt 9.643e-8
 pool1qzlk4mdgauljhk9eq4m6jmxtjyyeyjgjj0wk7vfmvwxrx22ljgs 6.213e-3
 pool1qrfa3jrqptfj0kg5pef7fup6ta70pdf7e7vjcgpxtrtsvxxf7ze 2.957e-10
 pool1qrazx9r2jtepdefa7h830az933vexudt9rpn0t2vky95k5k97my 1.245e-4
 ...
```

#### `bcc query stake-address-info --address`

Get the current delegations and reward balance filtered by stake address.

```console
$ bcc query stake-address-info --address stake_test1uqvjsz7a3xm7ylpzgdhvg29gd9686ss9kztxeaanwp9nreqq74692 --testnet

[
    {
        "address": "stake_test1uqvjsz7a3xm7ylpzgdhvg29gd9686ss9kztxeaanwp9nreqq74692",
        "rewardAccountBalance": 0,
        "delegation": null
    }
]
```

#### `bcc transaction submit --tx-file FILE`

```console
$ bcc transaction submit --tx-file /tmp/mytx --testnet

Transaction successfully submitted.
```

## Cardano CLI compatibility

Output of following commands should be compatible with `cardano-cli` (1.31.0) for all practical purposes. It is possible we have missed few things. If you encounter any problem while replacing cardano-cli with blockfrost-cardano-cli please open an issue.

- `bcc query`
  - `pool-params --stake-pool-id`
  - `protocol-parameters`
  - `tip`
  - `stake-distribution`
  - `stake-address-info --address`
  - `utxo --address`
- `bcc transaction`
  - `submit --tx-file`

Additionally, all commands support `--out-file FILE`, `--testnet` or `--testnet-magic 1097911063`.
