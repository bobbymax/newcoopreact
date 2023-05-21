import React, { useEffect, useState } from "react";
import {
  PDFViewer,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { useLocation } from "react-router-dom";

const styles = StyleSheet.create({
  viewer: {
    width: "100%",
    height: 680,
  },
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  section: {
    padding: "10px 20px",
  },
});

const PrintPayment = () => {
  const { state } = useLocation();

  const [batch, setBatch] = useState(null);
  const [expenditures, setExpenditures] = useState([]);
  const [paymentType, setPaymentType] = useState("");

  useEffect(() => {
    if (state !== null && state?.payment) {
      const { payment } = state;

      const exps = payment?.expenditures;

      setBatch(payment);
      setExpenditures(exps);
    }
  }, [state]);

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <PDFViewer style={styles.viewer}>
            <Document>
              <Page size="A4" style={styles.page}></Page>
            </Document>
          </PDFViewer>
        </div>
      </div>
    </>
  );
};

export default PrintPayment;
