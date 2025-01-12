import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";

export interface Receipt {
    costumer_name: string,
    costumer_phone: number,
    plan_name: string,
    amount_paid: number,
    payment_method: [
        string
    ]
    transaction_id: string,
    reference: string
}

// Initial user state
export class ReceiptStateModel {
  receipt: Receipt | null = null;
}

// Define actions
export class SetReceipt {
  static readonly type = '[Receipt] Set';
  constructor(public receipt: Receipt) {}
}

@Injectable()
@State<ReceiptStateModel>({
  name: 'receipt',
  defaults: {
    receipt: null,
  },
})
export class ReceiptState {
  @Selector()
  static receipt(state: ReceiptStateModel): Receipt | null {
    return state.receipt;
  }

  @Action(SetReceipt)
  setReceipt(ctx: StateContext<ReceiptStateModel>, action: SetReceipt) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      receipt: action.receipt,
    });
  }
}

