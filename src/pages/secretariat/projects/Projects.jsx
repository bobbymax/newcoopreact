import React, { useEffect, useState } from "react";
import Alert from "../../../app/services/alert";
import { collection } from "../../../app/http/controllers";
import PageHeader from "../../../template/includes/PageHeader";
import TableComponent from "../../../template/components/TableComponent";
import AddProject from "./AddProject";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    {
      field: "code",
      header: "Code",
      isSortable: false,
    },
    {
      field: "title",
      header: "Title",
      isSortable: true,
    },
    {
      field: "status",
      header: "Status",
      isSortable: true,
      status: true,
    },
    {
      field: "created_at",
      header: "Posted At",
      isSortable: false,
      date: true,
    },
  ];

  const manageProject = (project) => {
    setData(project);
    setIsUpdating(true);
    setShow(true);
  };

  const openModal = () => {
    setShow(true);
    setIsLoading(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setProjects(
        projects.map((vendor) => {
          if (vendor.id === response?.data?.id) {
            return response?.data;
          }

          return vendor;
        })
      );
    } else {
      setProjects([response?.data, ...projects]);
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
      collection("projects")
        .then((res) => {
          const response = res.data.data;
          setProjects(response);
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
      <AddProject
        title="Add Project"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        data={data}
      />

      <PageHeader
        pageName="Projects"
        text="Create Project"
        handleClick={openModal}
        icon="post_add"
        isLoading={isLoading}
        resource
      />

      <div className="data__content">
        <div className="row">
          <TableComponent
            columns={columns}
            data={projects}
            manage
            manageData={manageProject}
            isSearchable
          />
        </div>
      </div>
    </>
  );
};

export default Projects;
