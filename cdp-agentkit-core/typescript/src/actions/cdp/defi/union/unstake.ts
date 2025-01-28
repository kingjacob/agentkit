import { Wallet } from "@coinbase/coinbase-sdk";
import { z } from "zod";
import { Decimal } from "decimal.js";

import { CdpAction } from "../../cdp_action";
import { UNION_ADDRESSES, USER_MANAGER_ABI } from "./constants";

const UNSTAKE_PROMPT = `
This tool allows unstaking UNION tokens from the Union protocol.

It takes:
- amount: The amount of UNION tokens to unstake
- account: The account to unstake for (defaults to sender)

Examples:
- amount: "1000" to unstake 1000 UNION
- amount: "500.5" to unstake 500.5 UNION

Note: You can only unstake tokens that aren't being used as collateral for trust.
`;

export const UnionUnstakeInput = z.object({
  amount: z
    .string()
    .regex(/^\d+(\.\d+)?$/, "Must be a valid number")
    .refine(val => new Decimal(val).greaterThan(0), "Amount must be greater than 0")
    .describe("The amount of UNION tokens to unstake"),
  account: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address")
    .optional()
    .describe("The account to unstake for (defaults to sender)")
});

export async function unstakeFromUnion(
  wallet: Wallet,
  args: z.infer<typeof UnionUnstakeInput>
): Promise<string> {
  const amount = new Decimal(args.amount);
  const account = args.account || await wallet.getAddress();

  try {
    const invocation = await wallet.invokeContract({
      contractAddress: UNION_ADDRESSES.USER_MANAGER,
      method: "unstake",
      abi: USER_MANAGER_ABI,
      args: {
        account,
        amount: amount.toString()
      }
    });

    const result = await invocation.wait();

    return `Unstaked ${args.amount} UNION tokens for ${account} with transaction hash: ${result.getTransactionHash()} and transaction link: ${result.getTransactionLink()}`;
  } catch (error) {
    return `Error unstaking UNION tokens: ${error}`;
  }
}

export class UnionUnstakeAction implements CdpAction<typeof UnionUnstakeInput> {
  public name = "union_unstake";
  public description = UNSTAKE_PROMPT;
  public argsSchema = UnionUnstakeInput;
  public func = unstakeFromUnion;
} 