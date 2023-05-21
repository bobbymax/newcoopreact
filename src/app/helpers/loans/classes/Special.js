import Loan from "./Loan";

class Special extends Loan {
  constructor(params) {
    super(params);
    this.date = new Date();
  }

  init() {
    return {
      ...super.init(),
      deduction: this.getInterest(),
      remittance: this.requested - this.getInterest(),
      installments: this.getRepayments(),
    };
  }

  getRepayments() {
    let payments = [];
    payments.push({
      due_date: `5 January ${this.getYear() + 1}`,
      capital: this.requested,
      fee: this.requested,
      interest: 0,
      interestSum: this.getInterest(),
      balance: 0,
    });

    return payments;
  }

  getYear() {
    return this.date.getFullYear();
  }
}

export default Special;
