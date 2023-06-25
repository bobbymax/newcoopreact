import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { currency } from "../../../../app/helpers";

const borderColor = "#028910";
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: "#028910",
    borderBottomWidth: 1,
    alignItems: "center",
    fontStyle: "bold",
    textTransform: "uppercase",
  },
  beneficiary: {
    width: "30%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    fontSize: 9,
    padding: 5,
    textAlign: "left",
  },
  amount: {
    width: "22%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    fontSize: 9,
    padding: 5,
    textAlign: "left",
  },
  head: {
    width: "15%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    fontSize: 9,
    padding: 5,
    textAlign: "center",
  },
  purpose: {
    width: "30%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    fontSize: 9,
    padding: 5,
    textAlign: "left",
  },
});

const ExpenditureTableRow = ({ items }) => {
  const rows = items.map((item, i) => (
    <View style={styles.row} key={i}>
      <Text style={styles.beneficiary}>{item?.beneficiary}</Text>
      <Text style={styles.amount}>{currency(item?.amount)}</Text>
      <Text style={styles.head}>{item?.account_number}</Text>
      <Text style={styles.purpose}>{item?.bank_name}</Text>
    </View>
  ));

  return <Fragment>{rows}</Fragment>;
};

export default ExpenditureTableRow;
