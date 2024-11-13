import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Table from "./Table";
import CommonModal, { FieldConfig } from "./CommonModal";
import axios from "axios";
interface Job {
  _id?: string;
  title: string;
  description: string;
  experience: number;
}
const JobOperationSection = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [formData, setFormData] = useState<Job>({
    title: "",
    description: "",
    experience: 0,
  });
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  const handleShowModal = (): void => setShowModal(true);
  const handleCloseModal = (): void => {
    setShowModal(false);
    setFormData({ title: "", description: "", experience: 0 });
  };

  const handleShowDeleteModal = (job: Job): void => {
    setJobToDelete(job);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = (): void => {
    setShowDeleteModal(false);
    setJobToDelete(null);
  };

  useEffect(() => {
    getAllJobs();
  }, []);

  const getAllJobs = async () => {
    try {
      const response = await axios.get("/api/getjobs");
      if (response.status === 200) {
        setJobs(response.data.jobs);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddJob = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    if (isUpdate) {
      try {
        e.preventDefault();
        const response = await axios.put(`/api/jobs/${formData._id}`, formData);
        if (response.status === 200) {
          getAllJobs();
          setFormData({ title: "", description: "", experience: 0 });
          handleCloseModal();
          setIsUpdate(false);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        e.preventDefault();
        const response = await axios.post("/api/addjob", formData);
        if (response.status === 200) {
          getAllJobs();
          setFormData({ title: "", description: "", experience: 0 });
          handleCloseModal();
        }
      } catch (err: any) {
        console.log(err);
      }
    }
  };

  const handleDeleteJob = async (): Promise<void> => {
    if (!jobToDelete) return;
    try {
      const response = await axios.delete(`/api/jobs/${jobToDelete._id}`);
      if (response.status === 200) {
        getAllJobs();
        handleCloseDeleteModal();
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const handleUpdateJob = (job: Job): void => {
    setIsUpdate(true);
    setFormData(job);
    setShowModal(true);
  };

  const jobFields: FieldConfig[] = [
    {
      type: "text",
      label: "Job Title",
      name: "title",
      placeholder: "Enter job title",
    },
    {
      type: "number",
      label: "Minimum Experience (years)",
      name: "experience",
      placeholder: "Enter minimum experience",
    },
    {
      type: "textarea",
      label: "Job Description",
      name: "description",
      placeholder: "Enter job description",
      rows: 4,
    },
  ];
  return (
    <div className="container mx-auto px-6">
      <button
        className="bg-blue-400 hover:bg-blue-300 text-white px-6 py-3 rounded-full font-semibold transition duration-300 shadow-lg"
        onClick={handleShowModal}
      >
        Add Jobs
      </button>

      {showModal && (
        <CommonModal
          title="Add Job"
          handleSubmit={handleAddJob}
          formData={formData}
          handleChange={handleChange}
          handleCloseModal={handleCloseModal}
          fields={jobFields}
        />
      )}

      {showDeleteModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ease-in-out"
          style={{ opacity: showDeleteModal ? 1 : 0 }}
        >
          <div
            className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-8 rounded-xl shadow-2xl transition-all duration-300 ease-in-out transform"
            style={{
              opacity: showDeleteModal ? 1 : 0,
              transform: showDeleteModal ? "scale(1)" : "scale(0.9)",
            }}
          >
            <h2 className="text-2xl font-bold mb-4 text-blue-200">
              Confirm Deletion
            </h2>
            <p className="text-blue-50">
              Are you sure you want to delete this job?
            </p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-full transition duration-300"
                onClick={handleDeleteJob}
              >
                Delete
              </button>
              <button
                className="bg-blue-400 hover:bg-blue-300 text-white px-4 py-2 rounded-full transition duration-300"
                onClick={handleCloseDeleteModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12">
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl overflow-hidden shadow-2xl">
          <Table
            deleteFunction={handleShowDeleteModal}
            updateFunction={handleUpdateJob}
            tableContent={jobs}
            tableHeaders={["Title", "Description", "Experience"]}
          />
        </div>
      </div>
    </div>
  );
};

export default JobOperationSection;
