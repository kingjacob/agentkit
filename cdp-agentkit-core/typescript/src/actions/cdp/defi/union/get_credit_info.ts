import { Wallet } from "../../types";
import { z } from "zod";
import { Decimal } from "decimal.js";

import { CdpAction } from "../../cdp_action";
import { UNION_ADDRESSES, USER_MANAGER_ABI, MARKET_ABI } from "./constants";



const GET_CREDIT_INFO_PROMPT = `
This tool retrieves credit information for an account in the Union protocol.

It takes:
- account: The address to check (defaults to sender)

Returns:
- Credit limit
- Current borrowed amount
- Available credit
- Total trust received
- Number of trusters
`;

export const GetCreditInfoInput = z.object({
  account: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address")
    .optional()
    .describe("The account to check (defaults to sender)")
}); 

Examples:
- amount: "1000" to borrow 1000 USDC
- amount: "500.5" to borrow 500.5 USDC
- borrower: "0x1234...5678" amount: "1000" to trust 1000 USDC 

export async function getCreditInfo(
  wallet: Wallet,
  args: z.infer<typeof GetCreditInfoInput>
): Promise<string> {
  const account = args.account || await wallet.getAddress();

  try {
    const [creditLimit, borrowed, vouchingAmount] = await Promise.all([
      wallet.readContract({
        contractAddress: UNION_ADDRESSES.USER_MANAGER,
        method: "getCreditLimit",
        abi: USER_MANAGER_ABI,
        args: { account }
      }),
      wallet.readContract({
        contractAddress: UNION_ADDRESSES.MARKET,
        method: "getBorrowed",
        abi: MARKET_ABI,
        args: { account }
      }),
      wallet.readContract({
        contractAddress: UNION_ADDRESSES.USER_MANAGER,
        method: "getVouchingAmount",
        abi: USER_MANAGER_ABI,
        args: { staker: account }
      })
    ]);

    return `Credit Information for ${account}:
- Credit Limit: ${creditLimit} USDC
- Currently Borrowed: ${borrowed} USDC
- Available Credit: ${new Decimal(creditLimit).minus(borrowed)} USDC
- Total Trust Received: ${vouchingAmount} USDC`;
  } catch (error) {
    return `Error getting credit info: ${error}`;
  }
} 