/* eslint-disable no-useless-constructor */
import Loan from "./Loan";

class Car extends Loan {
  constructor(params) {
    super(params);
  }

  init() {
    return {
      ...super.init(),
      totalPayable: this.getTotalPayable(),
      interestSum: this.getInterest(),
      remittance: this.getRemittance(),
      deductable: this.getDeduction(),
      installments: this.getRepayments(),
    };
  }

  getMonths() {
    return [
      { month: "January", days: 31 },
      { month: "February", days: 28 },
      { month: "March", days: 31 },
      { month: "April", days: 30 },
      { month: "May", days: 31 },
      { month: "June", days: 30 },
      { month: "July", days: 31 },
      { month: "August", days: 31 },
      { month: "September", days: 30 },
      { month: "October", days: 31 },
      { month: "November", days: 30 },
      { month: "December", days: 31 },
    ];
  }

  getTotalPayable() {
    return this.getInterest() + this.getCommitment();
  }

  getInterest() {
    return (this.variant?.interest_rate / 100) * this.getCommitment();
  }

  getCommitment() {
    const commit_percentage = 100 - this.feature.commitment;
    return (commit_percentage / 100) * this.requested;
  }

  getDeduction() {
    return this.getCommitment() * (this.feature.percentage_deduction / 100);
  }

  getRemittance() {
    const deduc =
      this.getCommitment() * (this.feature.percentage_deduction / 100);

    return this.getCommitment() - deduc;
  }

  customInterest(principal, rate) {
    return (rate / 100) * principal;
  }

  getRepayments() {
    const months = this.getMonths();
    const tenor = this.getTenor() * 12;
    const deduction_month = this.feature.deduction_month;
    const deduct_from = months.filter(
      (mth) => mth.month === deduction_month
    )[0];
    const initial = months.slice(months.indexOf(deduct_from));
    const sliced = initial.slice(0, tenor);
    const profitInterest = this.customInterest(
      this.getCommitment(),
      this.variant?.interest_rate
    );

    const yearly_principal = this.getCommitment() / this.getTenor();

    let firsts = [...sliced];
    let formatter = [];
    let fYear = this.feature.deduction_year;

    const numSum = firsts
      .map((month) => month.days)
      .reduce((sum, curr) => sum + curr, 0);
    const daily_deductions = profitInterest / numSum;
    const principal_deduction = this.getCommitment() - yearly_principal;
    // eslint-disable-next-line no-unused-vars
    let bal = 0;
    let interest = profitInterest;

    for (let i = 0; i < firsts.length; i++) {
      const item = firsts[i];
      let bal = interest - daily_deductions * item.days;

      formatter.push({
        due_date: `26 ${item.month + " " + fYear}`,
        daily_deduction: profitInterest / numSum,
        capital: this.getCommitment(),
        fee: (profitInterest / numSum) * item.days,
        interest: 0,
        interestSum: profitInterest,
        balance: bal,
      });

      interest = bal;
    }

    if (tenor > formatter.length && principal_deduction > 0) {
      const diff = tenor - 12;
      const added = this.gatherMonths(
        diff,
        principal_deduction,
        yearly_principal
      );
      formatter.push(...added);
    }

    return formatter;
  }

  gatherMonths(diff, principal, deductable) {
    const months = this.getMonths();
    let result = [];
    let fYear = this.feature.deduction_year + 1;
    const arr = months.slice(0, diff);
    const profitInterest = this.customInterest(
      principal,
      this.variant?.interest_rate
    );

    const numSum = arr
      .map((ar) => ar.days)
      .reduce((sum, curr) => sum + curr, 0);
    const daily_deductions = profitInterest / numSum;

    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      if (item.month === "January" && i > 0) {
        fYear++;
      }

      result.push({
        due_date: `26 ${item.month + " " + fYear}`,
        capital: principal,
        fee: daily_deductions * item.days,
        interest: 0,
        interestSum: profitInterest,
        balance: profitInterest - daily_deductions * item.days,
      });
    }

    let deduction = principal - deductable;
    let newDiff = diff - arr.length;

    if (newDiff > 0 && deduction > 0) {
      result.push(...this.gatherMonths(newDiff, deduction, deductable));
    }

    return result;
  }
}

export default Car;
