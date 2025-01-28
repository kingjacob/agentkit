import { CdpAction, CdpActionSchemaAny } from "../../cdp_action";

import { UnionStakeAction } from "./stake";
import { UnionTrustAction } from "./trust";
import { UnionBorrowAction } from "./borrow";
import { UnionUnstakeAction } from "./unstake";
import { GetCreditInfoAction } from "./get_credit_info";

/**
 * Retrieves all Union protocol action instances.
 * WARNING: All new Union action classes must be instantiated here to be discovered.
 *
 * @returns - Array of Union action instances
 */
export function getAllUnionActions(): CdpAction<CdpActionSchemaAny>[] {
  return [
    new UnionStakeAction(),
    new UnionUnstakeAction(),
    new UnionTrustAction(),
    new UnionBorrowAction(),
    new UnionRepayAction(),
    new GetCreditInfoAction()
  ];
}

export const UNION_ACTIONS = getAllUnionActions();

export {
  UnionStakeAction,
  UnionTrustAction,
  UnionBorrowAction
}; 