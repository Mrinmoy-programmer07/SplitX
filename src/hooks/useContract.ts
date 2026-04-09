import {
  rpc,
  TransactionBuilder,
  Networks,
  Account,
  Operation,
  Address,
  nativeToScVal,
  scValToNative,
} from '@stellar/stellar-sdk'
import { CONTRACT_ID, SOROBAN_RPC_URL } from '../constants/contract'

const sorobanServer = new rpc.Server(SOROBAN_RPC_URL)

export interface ContractCallResult {
  contractTxHash: string
  expenseCount: number
}

/**
 * Logs an expense settlement to the on-chain expense_logger contract.
 *
 * Calls: log_expense(from: Address, amount: i128, timestamp: u64) -> u32
 *
 * @param walletAddress  - Connected wallet public key (sender / source)
 * @param amountXlm     - Amount settled in XLM (as string, e.g. "25.0000000")
 * @param signTx        - Signing function from useWalletKit
 */
export async function logExpenseOnChain(
  walletAddress: string,
  amountXlm: string,
  signTx: (xdr: string) => Promise<string>
): Promise<ContractCallResult> {
  if (CONTRACT_ID === 'PLACEHOLDER_DEPLOY_FIRST') {
    throw new Error('Contract not yet deployed. Please deploy the contract first.')
  }

  // 1. Build source account
  const accountData = await sorobanServer.getAccount(walletAddress)
  const account = new Account(walletAddress, accountData.sequenceNumber())

  // 2. Convert args to ScVal types expected by the contract 
  const amountStroops = BigInt(Math.round(parseFloat(amountXlm) * 10_000_000))
  const args = [
    new Address(walletAddress).toScVal(),                    // from: Address
    nativeToScVal(amountStroops, { type: 'i128' }),         // amount: i128 (in stroops)
    nativeToScVal(BigInt(Date.now()), { type: 'u64' }),     // timestamp: u64
  ]

  // 3. Build transaction with InvokeContractOp
  const tx = new TransactionBuilder(account, {
    fee: '1000000', // max fee for contract calls (1 XLM) — adjusted by simulation
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.invokeContractFunction({
        contract: CONTRACT_ID,
        function: 'log_expense',
        args,
      })
    )
    .setTimeout(60)
    .build()

  // 4. Simulate to get the resource footprint + adjusted fee
  const simResponse = await sorobanServer.simulateTransaction(tx)

  if (rpc.Api.isSimulationError(simResponse)) {
    throw new Error(`Contract simulation failed: ${simResponse.error}`)
  }

  // 5. Assemble the transaction with the simulation result (adds soroban data)
  const assembled = rpc.assembleTransaction(tx, simResponse).build()

  // 6. Sign via WalletsKit
  const signedXdr = await signTx(assembled.toXDR())

  // 7. Submit to Soroban RPC
  const submitResponse = await sorobanServer.sendTransaction(
    TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET)
  )

  if (submitResponse.status === 'ERROR') {
    throw new Error(`Contract TX failed: ${JSON.stringify(submitResponse.errorResult)}`)
  }

  const txHash = submitResponse.hash

  // 8. Poll for confirmation
  let getResponse = await sorobanServer.getTransaction(txHash)
  let attempts = 0

  while (getResponse.status === 'NOT_FOUND' && attempts < 30) {
    await new Promise((r) => setTimeout(r, 2000))
    getResponse = await sorobanServer.getTransaction(txHash)
    attempts++
  }

  if (getResponse.status !== 'SUCCESS') {
    throw new Error(`Contract TX not confirmed after polling. Status: ${getResponse.status}`)
  }

  // 9. Decode return value (u32 expense count)
  let expenseCount = 0
  if (getResponse.returnValue) {
    expenseCount = Number(scValToNative(getResponse.returnValue))
  }

  return { contractTxHash: txHash, expenseCount }
}
