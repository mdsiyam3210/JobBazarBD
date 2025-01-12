import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";


export interface Payment {
  plan_name: string,
  amount: number
}

// Initial user state
export class PaymentStateModel {
  payment: Payment | null = null;
}

// Define actions
export class SetPayment {
  static readonly type = '[Payment] Set';
  constructor(public payment: Payment) {}
}

@Injectable()
@State<PaymentStateModel>({
  name: 'payment',
  defaults: {
    payment: null,
  },
})
export class PaymentState {
  @Selector()
  static payment(state: PaymentStateModel): Payment | null {
    return state.payment;
  }

  @Action(SetPayment)
  setPayment(ctx: StateContext<PaymentStateModel>, action: SetPayment) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      payment: action.payment,
    });
  }
}
