import React, { useEffect, useState } from "react";
import Alert from "../../../app/services/alert";
import { batchRequests, collection } from "../../../app/http/controllers";
import TableComponent from "../../../template/components/TableComponent";
import PageHeader from "../../../template/includes/PageHeader";
import CreateSubBudgetHead from "./CreateSubBudgetHead";
import axios from "axios";

const SubBudgetHeads = () => {
  const [subBudgetHeads, setSubBudgetHeads] = useState([]);
  const [budgetHeads, setBudgetHeads] = useState([]);
  const [categories, setCategories] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    {
      field: "code",
      header: "Code",
      isSortable: true,
      currency: false,
    },
    {
      field: "budget_head_name",
      header: "Head",
      isSortable: true,
      currency: false,
    },
    {
      field: "name",
      header: "Name",
      isSortable: true,
      currency: false,
    },
    {
      field: "type",
      header: "Type",
      isSortable: false,
      currency: false,
    },
    {
      field: "group",
      header: "Group",
      isSortable: true,
      currency: false,
    },
    {
      field: "year",
      header: "Period",
      isSortable: false,
      currency: false,
    },
    {
      field: "approved_amount",
      header: "Approved",
      isSortable: true,
      currency: true,
    },
  ];

  const manageSubBudgetHead = (sub) => {
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
      setSubBudgetHeads(
        subBudgetHeads.map((dept) => {
          if (dept.id === response?.data?.id) {
            return response?.data;
          }

          return dept;
        })
      );
    } else {
      setSubBudgetHeads([response?.data, ...subBudgetHeads]);
    }

    Alert.success(response?.status, response?.message);
    setIsUpdating(false);
    setShow(false);
    setData(undefined);
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
      const budsData = collection("budgetHeads");
      const catsData = collection("categories");

      batchRequests([subsData, budsData, catsData])
        .then(
          axios.spread((...res) => {
            setSubBudgetHeads(res[0].data.data);
            setBudgetHeads(res[1].data.data);
            setCategories(res[2].data.data);
          })
        )
        .catch((err) => {
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <CreateSubBudgetHead
        title="Add Sub Budget Head"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        data={data}
        dependencies={{ categories, budgetHeads }}
      />
      <PageHeader
        pageName="Sub Budget Heads"
        text="Create Sub Budget Head"
        handleClick={openModal}
        icon="post_add"
        isLoading={isLoading}
        resource
      />

      <div className="data__content">
        <div className="row">
          <TableComponent
            columns={columns}
            data={subBudgetHeads}
            manage
            manageData={manageSubBudgetHead}
            isSearchable
          />
        </div>
      </div>
    </>
  );
};

export default SubBudgetHeads;
