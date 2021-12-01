import { BaseCommand } from '../../helpers/base-command';
import { stringToBigInt } from '../../utils/format';

// cardano-cli response
// {
//   "txFeePerByte": 44,
//   "minUTxOValue": null,
//   "decentralization": 0,
//   "utxoCostPerWord": 34482,
//   "stakePoolDeposit": 500000000,
//   "poolRetireMaxEpoch": 18,
//   "extraPraosEntropy": null,
//   "collateralPercentage": 150,
//   "stakePoolTargetNum": 500,
//   "maxBlockBodySize": 65536,
//   "minPoolCost": 340000000,
//   "maxTxSize": 16384,
//   "treasuryCut": 0.2,
//   "maxBlockExecutionUnits": {
//       "memory": 50000000,
//       "steps": 40000000000
//   },
//   "maxCollateralInputs": 3,
//   "maxValueSize": 5000,
//   "maxBlockHeaderSize": 1100,
//   "maxTxExecutionUnits": {
//       "memory": 10000000,
//       "steps": 10000000000
//   },
//   "costModels": {
//       "PlutusScriptV1": {
//           "cekConstCost-exBudgetMemory": 100,
//           "unBData-cpu-arguments": 150000,
//           "divideInteger-memory-arguments-minimum": 1,
//           "nullList-cpu-arguments": 150000,
//           "cekDelayCost-exBudgetMemory": 100,
//           "appendByteString-cpu-arguments-slope": 621,
//           "sha2_256-memory-arguments": 4,
//           "multiplyInteger-cpu-arguments-intercept": 61516,
//           "iData-cpu-arguments": 150000,
//           "equalsString-cpu-arguments-intercept": 150000,
//           "trace-cpu-arguments": 150000,
//           "lessThanEqualsByteString-cpu-arguments-intercept": 103599,
//           "encodeUtf8-cpu-arguments-slope": 1000,
//           "equalsString-cpu-arguments-constant": 1000,
//           "blake2b-cpu-arguments-slope": 29175,
//           "consByteString-memory-arguments-intercept": 0,
//           "headList-cpu-arguments": 150000,
//           "listData-cpu-arguments": 150000,
//           "divideInteger-cpu-arguments-model-arguments-slope": 118,
//           "divideInteger-memory-arguments-slope": 1,
//           "bData-cpu-arguments": 150000,
//           "chooseData-memory-arguments": 32,
//           "cekBuiltinCost-exBudgetCPU": 29773,
//           "mkNilData-memory-arguments": 32,
//           "equalsInteger-cpu-arguments-intercept": 136542,
//           "lengthOfByteString-cpu-arguments": 150000,
//           "subtractInteger-cpu-arguments-slope": 0,
//           "unIData-cpu-arguments": 150000,
//           "sliceByteString-cpu-arguments-slope": 5000,
//           "unMapData-cpu-arguments": 150000,
//           "modInteger-cpu-arguments-model-arguments-slope": 118,
//           "lessThanInteger-cpu-arguments-intercept": 179690,
//           "appendString-memory-arguments-intercept": 0,
//           "mkCons-cpu-arguments": 150000,
//           "sha3_256-cpu-arguments-slope": 82363,
//           "ifThenElse-cpu-arguments": 1,
//           "mkNilPairData-cpu-arguments": 150000,
//           "constrData-memory-arguments": 32,
//           "lessThanEqualsInteger-cpu-arguments-intercept": 145276,
//           "addInteger-memory-arguments-slope": 1,
//           "chooseList-memory-arguments": 32,
//           "equalsData-memory-arguments": 1,
//           "decodeUtf8-cpu-arguments-intercept": 150000,
//           "bData-memory-arguments": 32,
//           "lessThanByteString-cpu-arguments-slope": 248,
//           "listData-memory-arguments": 32,
//           "consByteString-cpu-arguments-intercept": 150000,
//           "headList-memory-arguments": 32,
//           "subtractInteger-memory-arguments-slope": 1,
//           "appendByteString-memory-arguments-intercept": 0,
//           "unIData-memory-arguments": 32,
//           "remainderInteger-memory-arguments-minimum": 1,
//           "lengthOfByteString-memory-arguments": 4,
//           "encodeUtf8-memory-arguments-intercept": 0,
//           "cekStartupCost-exBudgetCPU": 100,
//           "remainderInteger-memory-arguments-slope": 1,
//           "multiplyInteger-memory-arguments-intercept": 0,
//           "cekForceCost-exBudgetCPU": 29773,
//           "unListData-memory-arguments": 32,
//           "sha2_256-cpu-arguments-slope": 29175,
//           "indexByteString-memory-arguments": 1,
//           "equalsInteger-memory-arguments": 1,
//           "remainderInteger-cpu-arguments-model-arguments-slope": 118,
//           "cekVarCost-exBudgetCPU": 29773,
//           "lessThanEqualsInteger-cpu-arguments-slope": 1366,
//           "addInteger-memory-arguments-intercept": 1,
//           "sndPair-cpu-arguments": 150000,
//           "lessThanInteger-memory-arguments": 1,
//           "cekLamCost-exBudgetCPU": 29773,
//           "chooseUnit-cpu-arguments": 150000,
//           "decodeUtf8-cpu-arguments-slope": 1000,
//           "fstPair-cpu-arguments": 150000,
//           "quotientInteger-memory-arguments-minimum": 1,
//           "lessThanEqualsInteger-memory-arguments": 1,
//           "chooseUnit-memory-arguments": 32,
//           "fstPair-memory-arguments": 32,
//           "quotientInteger-cpu-arguments-constant": 148000,
//           "mapData-cpu-arguments": 150000,
//           "unConstrData-cpu-arguments": 150000,
//           "mkPairData-cpu-arguments": 150000,
//           "sndPair-memory-arguments": 32,
//           "decodeUtf8-memory-arguments-slope": 8,
//           "equalsData-cpu-arguments-intercept": 150000,
//           "addInteger-cpu-arguments-intercept": 197209,
//           "modInteger-memory-arguments-intercept": 0,
//           "cekStartupCost-exBudgetMemory": 100,
//           "divideInteger-cpu-arguments-model-arguments-intercept": 425507,
//           "divideInteger-memory-arguments-intercept": 0,
//           "cekVarCost-exBudgetMemory": 100,
//           "consByteString-memory-arguments-slope": 1,
//           "cekForceCost-exBudgetMemory": 100,
//           "unListData-cpu-arguments": 150000,
//           "subtractInteger-cpu-arguments-intercept": 197209,
//           "indexByteString-cpu-arguments": 150000,
//           "equalsInteger-cpu-arguments-slope": 1326,
//           "lessThanByteString-memory-arguments": 1,
//           "blake2b-cpu-arguments-intercept": 2477736,
//           "encodeUtf8-cpu-arguments-intercept": 150000,
//           "multiplyInteger-cpu-arguments-slope": 11218,
//           "tailList-cpu-arguments": 150000,
//           "appendByteString-cpu-arguments-intercept": 396231,
//           "equalsString-cpu-arguments-slope": 1000,
//           "lessThanEqualsByteString-cpu-arguments-slope": 248,
//           "remainderInteger-cpu-arguments-constant": 148000,
//           "chooseList-cpu-arguments": 150000,
//           "equalsByteString-memory-arguments": 1,
//           "constrData-cpu-arguments": 150000,
//           "cekApplyCost-exBudgetCPU": 29773,
//           "equalsData-cpu-arguments-slope": 10000,
//           "decodeUtf8-memory-arguments-intercept": 0,
//           "modInteger-memory-arguments-slope": 1,
//           "addInteger-cpu-arguments-slope": 0,
//           "appendString-cpu-arguments-intercept": 150000,
//           "quotientInteger-cpu-arguments-model-arguments-slope": 118,
//           "unMapData-memory-arguments": 32,
//           "cekApplyCost-exBudgetMemory": 100,
//           "quotientInteger-memory-arguments-slope": 1,
//           "mkNilPairData-memory-arguments": 32,
//           "ifThenElse-memory-arguments": 1,
//           "equalsByteString-cpu-arguments-slope": 247,
//           "sliceByteString-memory-arguments-slope": 1,
//           "sha3_256-memory-arguments": 4,
//           "mkCons-memory-arguments": 32,
//           "verifySignature-cpu-arguments-intercept": 3345831,
//           "cekBuiltinCost-exBudgetMemory": 100,
//           "remainderInteger-memory-arguments-intercept": 0,
//           "lessThanEqualsByteString-memory-arguments": 1,
//           "mkNilData-cpu-arguments": 150000,
//           "equalsString-memory-arguments": 1,
//           "chooseData-cpu-arguments": 150000,
//           "remainderInteger-cpu-arguments-model-arguments-intercept": 425507,
//           "tailList-memory-arguments": 32,
//           "sha2_256-cpu-arguments-intercept": 2477736,
//           "multiplyInteger-memory-arguments-slope": 1,
//           "iData-memory-arguments": 32,
//           "divideInteger-cpu-arguments-constant": 148000,
//           "cekDelayCost-exBudgetCPU": 29773,
//           "encodeUtf8-memory-arguments-slope": 8,
//           "subtractInteger-memory-arguments-intercept": 1,
//           "nullList-memory-arguments": 32,
//           "lessThanByteString-cpu-arguments-intercept": 103599,
//           "appendByteString-memory-arguments-slope": 1,
//           "blake2b-memory-arguments": 4,
//           "unBData-memory-arguments": 32,
//           "cekConstCost-exBudgetCPU": 29773,
//           "consByteString-cpu-arguments-slope": 1000,
//           "trace-memory-arguments": 32,
//           "quotientInteger-memory-arguments-intercept": 0,
//           "mapData-memory-arguments": 32,
//           "verifySignature-cpu-arguments-slope": 1,
//           "quotientInteger-cpu-arguments-model-arguments-intercept": 425507,
//           "modInteger-cpu-arguments-constant": 148000,
//           "appendString-cpu-arguments-slope": 1000,
//           "unConstrData-memory-arguments": 32,
//           "mkPairData-memory-arguments": 32,
//           "equalsByteString-cpu-arguments-constant": 150000,
//           "equalsByteString-cpu-arguments-intercept": 112536,
//           "sliceByteString-memory-arguments-intercept": 0,
//           "lessThanInteger-cpu-arguments-slope": 497,
//           "verifySignature-memory-arguments": 1,
//           "cekLamCost-exBudgetMemory": 100,
//           "sliceByteString-cpu-arguments-intercept": 150000,
//           "modInteger-cpu-arguments-model-arguments-intercept": 425507,
//           "modInteger-memory-arguments-minimum": 1,
//           "appendString-memory-arguments-slope": 1,
//           "sha3_256-cpu-arguments-intercept": 0
//       }
//   },
//   "protocolVersion": {
//       "minor": 0,
//       "major": 6
//   },
//   "txFeeFixed": 155381,
//   "stakeAddressDeposit": 2000000,
//   "monetaryExpansion": 3.0e-3,
//   "poolPledgeInfluence": 0.3,
//   "executionUnitPrices": {
//       "priceSteps": 7.21e-5,
//       "priceMemory": 5.77e-2
//   }
// }

export class ProtocolParameters extends BaseCommand {
  doWork = async () => {
    const client = await this.getClient();

    const latestEpoch = await client.epochsLatest();
    const epochParams = await client.epochsParameters(latestEpoch.epoch);

    const response = {
      txFeePerByte: epochParams.min_fee_a,
      minUTxOValue: stringToBigInt(epochParams.min_utxo),
      decentralization: epochParams.decentralisation_param,
      utxoCostPerWord: stringToBigInt(epochParams.coins_per_utxo_word),
      stakePoolDeposit: stringToBigInt(epochParams.pool_deposit),
      poolRetireMaxEpoch: epochParams.e_max,
      extraPraosEntropy: epochParams.extra_entropy,
      collateralPercentage: epochParams.collateral_percent,
      stakePoolTargetNum: 500,
      maxBlockBodySize: epochParams.max_block_size,
      minPoolCost: stringToBigInt(epochParams.min_pool_cost),
      maxTxSize: epochParams.max_tx_size,
      treasuryCut: epochParams.tau,
      maxBlockExecutionUnits: {
        memory: stringToBigInt(epochParams.max_block_ex_mem),
        steps: stringToBigInt(epochParams.max_block_ex_steps),
      },
      maxCollateralInputs: epochParams.max_collateral_inputs,
      maxValueSize: stringToBigInt(epochParams.max_val_size),
      maxBlockHeaderSize: epochParams.max_block_header_size,
      maxTxExecutionUnits: {
        memory: stringToBigInt(epochParams.max_tx_ex_mem),
        steps: stringToBigInt(epochParams.max_tx_ex_steps),
      },
      costModels: {},
      protocolVersion: {
        minor: epochParams.protocol_minor_ver,
        major: epochParams.protocol_major_ver,
      },
      txFeeFixed: epochParams.min_fee_b,
      stakeAddressDeposit: stringToBigInt(epochParams.key_deposit),
      monetaryExpansion: epochParams.rho,
      poolPledgeInfluence: epochParams.a0,
      executionUnitPrices: {
        priceSteps: epochParams.price_step,
        priceMemory: epochParams.price_mem,
      },
    };
    return response;
  };
}
