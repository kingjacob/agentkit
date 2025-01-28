import { Wallet } from "@coinbase/coinbase-sdk";
import { z } from "zod";
import { Decimal } from "decimal.js";

import { CdpAction } from "../../cdp_action";
import { UNION_ADDRESSES, USER_MANAGER_ABI } from "./constants";

const TRUST_PROMPT = `
This tool allows updating trust for a borrower in the Union protocol.

Important: Your wallet must be a registered member of Union protocol to extend trust to others.
You must also have staked UNION tokens to back your trust.

It takes:
- borrower: The address of the borrower to trust
- amount: The amount of trust to extend (in USDC)

Examples:
- borrower: "0x1234...5678" amount: "1000" to trust 1000 USDC
- borrower: "0x1234...5678" amount: "500.5" to trust 500.5 USDC

Note: The amount of trust you can extend is limited by your staked UNION tokens.
`;

export const UnionTrustInput = z
  .object({
    borrower: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address")
      .describe("The borrower address to trust"),
    amount: z
      .string()
      .regex(/^\d+(\.\d+)?$/, "Must be a valid number")
      .describe("The amount of trust to extend (in USDC)")
  })
  .describe("Input schema for Union trust action");

export async function trustInUnion(
  wallet: Wallet,
  args: z.infer<typeof UnionTrustInput>
): Promise<string> {
  const amount = new Decimal(args.amount);

  if (amount.isNegative()) {
    return "Error: Trust amount cannot be negative";
  }

  try {
    const invocation = await wallet.invokeContract({
      contractAddress: UNION_ADDRESSES.USER_MANAGER,
      method: "updateTrust",
      abi: USER_MANAGER_ABI,
      args: {
        borrower: args.borrower,
        amount: amount.toString()
      }
    });

    const result = await invocation.wait();

    return `Updated trust for ${args.borrower} to ${args.amount} USDC with transaction hash: ${result.getTransactionHash()} and transaction link: ${result.getTransactionLink()}`;
  } catch (error) {
    return `Error updating trust: ${error}`;
  }
}

export class UnionTrustAction implements CdpAction<typeof UnionTrustInput> {
  public name = "union_trust";
  public description = TRUST_PROMPT;
  public argsSchema = UnionTrustInput;
  public func = trustInUnion;
} 