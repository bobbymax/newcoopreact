import React, { useEffect, useState } from "react";
import Alert from "../../../app/services/alert";
import { collection } from "../../../app/http/controllers";
import TableComponent from "../../../template/components/TableComponent";
import AddCategory from "./AddCategory";
import PageHeader from "../../../template/includes/PageHeader";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    {
      field: "name",
      header: "Name",
      isSortable: true,
    },
    {
      field: "label",
      header: "Label",
      isSortable: false,
    },
  ];

  const manageCategory = (cat) => {
    setData(cat);
    setIsUpdating(true);
    setShow(true);
  };

  const openModal = () => {
    setShow(true);
    setIsLoading(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setCategories(
        categories.map((dept) => {
          if (dept.id === response?.data?.id) {
            return response?.data;
          }

          return dept;
        })
      );
    } else {
      setCategories([response?.data, ...categories]);
    }

    Alert.success(response?.status, response?.message);
    handleClose();
  };

  const handleClose = () => {
    setIsUpdating(false);
    setShow(false);
    setData(undefined);
    setIsLoading(false);
  };

  useEffect(() => {
    try {
      collection("categories")
        .then((res) => {
          const response = res.data.data;
          setCategories(response);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <AddCategory
        title="Add Category"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        data={data}
      />
      <PageHeader
        pageName="Categories"
        text="Create Category"
        handleClick={openModal}
        icon="post_add"
        isLoading={isLoading}
        resource
      />

      <div className="data__content">
        <div className="row">
          <TableComponent
            columns={columns}
            data={categories}
            manage
            manageData={manageCategory}
            isSearchable
          />
        </div>
      </div>
    </>
  );
};

export default Categories;
