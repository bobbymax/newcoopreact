import React, { useEffect, useState } from "react";
import Alert from "../../../app/services/alert";
import { batchRequests, collection } from "../../../app/http/controllers";
import TableComponent from "../../../template/components/TableComponent";
import PageHeader from "../../../template/includes/PageHeader";
import AddFeatures from "./AddFeatures";
import axios from "axios";

const Features = () => {
  const [subBudgetHeads, setSubBudgetHeads] = useState([]);
  const [features, setFeatures] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    {
      field: "subBudgetHeadName",
      header: "Budget",
      isSortable: false,
      currency: false,
      percentage: false,
    },
    {
      field: "frequency",
      header: "Frequency",
      isSortable: false,
      currency: false,
      percentage: false,
    },
    {
      field: "commitment",
      header: "Commitment",
      isSortable: false,
      currency: false,
      percentage: false,
    },
    {
      field: "max_repayment_tenor",
      header: "Max Payment Term",
      isSortable: false,
      currency: false,
      percentage: false,
    },
    {
      field: "offer_limit",
      header: "Limit",
      isSortable: false,
      currency: false,
      percentage: false,
    },
    {
      field: "payable_from",
      header: "Deduction",
      isSortable: false,
      currency: false,
      percentage: false,
    },
  ];

  const manageFeature = (sub) => {
    setData(sub);
    setIsUpdating(true);
    setShow(true);
  };

  const openModal = () => {
    setShow(true);
    setIsLoading(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setFeatures(
        features.map((feature) => {
          if (feature.id === response?.data?.id) {
            return response?.data;
          }

          return feature;
        })
      );
    } else {
      setFeatures([response?.data, ...features]);
    }

    Alert.success(response?.status, response?.message);
    setIsUpdating(false);
    setShow(false);
    setData(undefined);
    setIsLoading(false);
  };

  const handleClose = () => {
    setIsUpdating(false);
    setShow(false);
    setData(undefined);
    setIsLoading(false);
  };

  useEffect(() => {
    try {
      const subsData = collection("subBudgetHeads");
      const featuresData = collection("features");

      batchRequests([subsData, featuresData])
        .then(
          axios.spread((...res) => {
            const response = res[0].data.data;
            setSubBudgetHeads(response?.filter((sub) => sub?.feature === null));
            setFeatures(res[1].data.data);
          })
        )
        .catch((err) => {
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  // console.log(features);

  return (
    <>
      <AddFeatures
        title="Add Feature"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        data={data}
        dependencies={{ subBudgetHeads }}
      />
      <PageHeader
        pageName="Features"
        text="Add Feature"
        handleClick={openModal}
        icon="post_add"
        isLoading={isLoading}
        resource
      />

      <div className="data__content">
        <div className="row">
          <TableComponent
            columns={columns}
            data={features}
            manage
            manageData={manageFeature}
            isSearchable
          />
        </div>
      </div>
    </>
  );
};

export default Features;
