import React from "react";
import { View, StyleSheet } from "@react-pdf/renderer";
import ExpenditureTableHeader from "./ExpenditureTableHeader";
import ExpenditureTableRow from "./ExpenditureTableRow";

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    margin: 18,
    borderWidth: 1,
    borderColor: "#028910",
  },
});

const ExpenditureTable = ({ expenditures }) => {
  return (
    <>
      <View style={styles.tableContainer}>
        <ExpenditureTableHeader />
        <ExpenditureTableRow items={expenditures} />
      </View>
    </>
  );
};

export default ExpenditureTable;
