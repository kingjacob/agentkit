import { Asset, Wallet } from "@coinbase/coinbase-sdk";
import { z } from "zod";
import { Decimal } from "decimal.js";

import { CdpAction } from "../../cdp_action";
import { approve } from "../../utils";
import { UNION_ADDRESSES, USER_MANAGER_ABI } from "./constants";

const STAKE_PROMPT = `
This tool allows staking UNION tokens into the Union protocol.

It takes:
- amount: The amount of UNION tokens to stake
- account: The account to stake for (defaults to sender)

Examples:
- 100 UNION
- 10.5 UNION
`;

export const UnionStakeInput = z
  .object({
    amount: z
      .string()
      .regex(/^\d+(\.\d+)?$/, "Must be a valid number")
      .describe("The amount of UNION tokens to stake"),
    account: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address")
      .optional()
      .describe("The account to stake for (defaults to sender)")
  })
  .describe("Input schema for Union stake action");

export async function stakeToUnion(
  wallet: Wallet,
  args: z.infer<typeof UnionStakeInput>
): Promise<string> {
  const amount = new Decimal(args.amount);
  
  if (amount.isNegative() || amount.isZero()) {
    return "Error: Amount must be greater than 0";
  }

  try {
    const unionToken = await Asset.fetch(wallet.getNetworkId(), UNION_ADDRESSES.UNION_TOKEN);
    const atomicAmount = unionToken.toAtomicAmount(amount);

    const approvalResult = await approve(
      wallet,
      UNION_ADDRESSES.UNION_TOKEN,
      UNION_ADDRESSES.USER_MANAGER,
      atomicAmount
    );

    if (approvalResult.startsWith("Error")) {
      return `Error approving UNION tokens: ${approvalResult}`;
    }

    const account = args.account || await wallet.getAddress();

    const invocation = await wallet.invokeContract({
      contractAddress: UNION_ADDRESSES.USER_MANAGER,
      method: "stake",
      abi: USER_MANAGER_ABI,
      args: {
        account,
        amount: atomicAmount.toString()
      }
    });

    const result = await invocation.wait();

    return `Staked ${args.amount} UNION tokens for ${account} with transaction hash: ${result.getTransactionHash()} and transaction link: ${result.getTransactionLink()}`;
  } catch (error) {
    return `Error staking UNION tokens: ${error}`;
  }
}

export class UnionStakeAction implements CdpAction<typeof UnionStakeInput> {
  public name = "union_stake";
  public description = STAKE_PROMPT;
  public argsSchema = UnionStakeInput;
  public func = stakeToUnion;
} 