import { Wallet } from "../../types";
import { z } from "zod";
import { Decimal } from "decimal.js";

import { CdpAction } from "../../cdp_action";
import { UNION_ADDRESSES, MARKET_ABI, USER_MANAGER_ABI } from "./constants";

const BORROW_PROMPT = `
This tool allows borrowing USDC from the Union protocol.

It takes:
- amount: The amount of USDC to borrow

Your borrowing capacity is determined by:
1. The total trust you've received from other members
2. Your existing borrowed amount
3. The global borrowing limit

Available credit = min(totalTrust - borrowed, globalBorrowLimit)

Examples:
- amount: "1000" to borrow 1000 USDC
- amount: "500.5" to borrow 500.5 USDC
- borrower: "0x1234...5678" amount: "1000" to trust 1000 USDC 

Note: You must have sufficient trust from other members to borrow. The transaction will fail if you try to borrow more than your available credit limit.
`;

export const UnionBorrowInput = z
  .object({
    amount: z
      .string()
      .regex(/^\d+(\.\d+)?$/, "Must be a valid number")
      .describe("The amount of USDC to borrow (must be within your available credit limit)")
  })
  .describe("Input schema for Union borrow action");

export async function borrowFromUnion(
  wallet: Wallet,
  args: z.infer<typeof UnionBorrowInput>
): Promise<string> {
  const amount = new Decimal(args.amount);

  if (amount.isNegative() || amount.isZero()) {
    return "Error: Amount must be greater than 0";
  }

  try {
    // Check credit limit before attempting to borrow
    const userAddress = await wallet.getAddress();
    const creditLimit = await wallet.readContract({
      contractAddress: UNION_ADDRESSES.USER_MANAGER,
      method: "getCreditLimit",
      abi: USER_MANAGER_ABI,
      args: { account: userAddress }
    });

    if (amount.greaterThan(creditLimit)) {
      return `Error: Borrow amount (${amount}) exceeds your credit limit (${creditLimit})`;
    }

    const invocation = await wallet.invokeContract({
      contractAddress: UNION_ADDRESSES.MARKET,
      method: "borrow",
      abi: MARKET_ABI,
      args: {
        amount: amount.toString()
      }
    });

    const result = await invocation.wait();

    return `Borrowed ${args.amount} USDC with transaction hash: ${result.getTransactionHash()} and transaction link: ${result.getTransactionLink()}`;
  } catch (error) {
    if (error.toString().includes("insufficient credit limit")) {
      return "Error: Insufficient credit limit. Please check your available credit before borrowing.";
    }
    return `Error borrowing from Union: ${error}`;
  }
}

export class UnionBorrowAction implements CdpAction<typeof UnionBorrowInput> {
  public name = "union_borrow";
  public description = BORROW_PROMPT;
  public argsSchema = UnionBorrowInput;
  public func = borrowFromUnion;
}

export class GetCreditInfoAction implements CdpAction<typeof GetCreditInfoInput> {
  public name = "get_credit_info";
  public description = GET_CREDIT_INFO_PROMPT;
  public argsSchema = GetCreditInfoInput;
  public func = getCreditInfo;
} 