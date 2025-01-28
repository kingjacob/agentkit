import { Wallet } from "../../types";
import { Decimal } from "decimal.js";
import { UNION_ADDRESSES, USER_MANAGER_ABI, MARKET_ABI } from "./constants";

export async function getAvailableCredit(wallet: Wallet, account: string): Promise<Decimal> {
  const creditLimit = await wallet.readContract({
    contractAddress: UNION_ADDRESSES.USER_MANAGER,
    method: "getCreditLimit",
    abi: USER_MANAGER_ABI,
    args: { account }
  });

  const borrowed = await wallet.readContract({
    contractAddress: UNION_ADDRESSES.MARKET,
    method: "getBorrowed",
    abi: MARKET_ABI,
    args: { account }
  });

  return new Decimal(creditLimit.toString()).minus(borrowed.toString());
}

export async function getTotalTrust(wallet: Wallet, account: string): Promise<Decimal> {
  const vouchingAmount = await wallet.readContract({
    contractAddress: UNION_ADDRESSES.USER_MANAGER,
    method: "getVouchingAmount",
    abi: USER_MANAGER_ABI,
    args: { staker: account }
  });

  return new Decimal(vouchingAmount.toString());
} 