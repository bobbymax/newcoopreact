class Loan {
  constructor(params) {
    const { subBudgetHead, requested, feature, variant, preferred_tenor } =
      params;

    this.subBudgetHead = subBudgetHead;
    this.requested = parseFloat(requested);
    this.feature = feature;
    this.variant = variant;
    this.preferred_tenor = preferred_tenor;
  }

  init() {
    return {
      interestRate: this.getInterestRate(),
      totalPayable: this.getTotalPayable(),
      interestSum: this.getInterest(),
      remittance: this.requested,
      commitment: this.feature?.commitment,
      deductable: this.getDeduction(),
      installments: this.formatMonthlyRepayments(),
    };
  }

  getTenor() {
    return this.preferred_tenor > 0
      ? this.preferred_tenor
      : this.variant?.tenor;
  }

  getRepayments() {
    const months = this.getMonths();
    const tenor = this.getTenor();
    const deduct_from = this.feature?.deduction_month;
    const first_slice = months.slice(months.indexOf(deduct_from));
    const slicer = first_slice.slice(0, tenor);
    let first = [...slicer];

    if (tenor > first.length) {
      const diff = tenor - first.length;
      const added = this.gatherMonths(diff);
      first.push(...added);
    }

    return first;
  }

  gatherMonths(diff) {
    const months = this.getMonths();
    let result = [];
    const arr = months.slice(0, diff);
    result.push(...arr);

    let newDiff = diff - arr.length;

    if (newDiff > 0) {
      result.push(...this.gatherMonths(newDiff));
    }

    return result;
  }

  formatMonthlyRepayments() {
    const months = this.getRepayments();
    let formatter = [];
    let fYear = this.feature?.deduction_year;

    for (let i = 0; i < months.length; i++) {
      const item = months[i];
      if (item === "January" && i > 0) {
        fYear++;
      }

      formatter.push({
        due_date: `26 ${item + " " + fYear}`,
        capital: this.getTotalPayable(),
        fee: this.getTotalPayable() / this.getTenor(),
        interest: 0,
        interestSum: this.getInterest(),
        balance: 0,
      });
    }

    return formatter;
  }

  getInterest() {
    return (this.variant?.interest_rate / 100) * this.requested;
  }

  getTotalPayable() {
    return this.getInterest() + this.requested;
  }

  getDeduction() {
    return this.feature?.percentage_deduction;
  }

  getMonths() {
    return [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
  }

  getInterestRate() {
    return this.variant?.interest_rate;
  }
}

export default Loan;
