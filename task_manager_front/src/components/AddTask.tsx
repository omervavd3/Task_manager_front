import { useForm } from "react-hook-form";
import { FC } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import "../custom.css";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z
    .string()
    .min(1, "Date is required")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
});

type dataForAxios = {
  title: string;
  description: string;
  date: string;
  isComplete?: boolean;
  userId?: string;
};

type FormData = z.infer<typeof schema>;

interface AddTaskProps {
  userId: string;
  renderTasks: () => void;
  toggleShowAddTask: () => void;
}

const AddTask: FC<AddTaskProps> = ({
  userId,
  renderTasks,
  toggleShowAddTask,
}) => {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: dataForAxios) => {
    data.isComplete = false;
    data.userId = userId;
    reset();
    console.log(data);
    axios
      .post("http://localhost:3000/task", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        console.log(response);
        renderTasks();
        toggleShowAddTask();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="d-flex align-items-center justify-content-center ">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="title" className="form-label">
          Title
        </label>
        <input
          id="title"
          {...register("title")}
          type="text"
          placeholder="Enter Title"
          className={`form-control ${errors.title ? "is-invalid" : ""}`}
          autoComplete="off"
        />
        {errors.title && <p className="text-danger">{errors.title.message}</p>}

        <label htmlFor="description" className="form-label">
          Description
        </label>
        <input
          id="description"
          {...register("description")}
          type="textarea"
          placeholder="Enter description"
          className={`form-control ${errors.description ? "is-invalid" : ""}`}
          autoComplete="off"
        />
        {errors.description && (
          <p className="text-danger">{errors.description.message}</p>
        )}

        <label htmlFor="date" className="form-label">
          Due Date
        </label>
        <input
          id="date"
          {...register("date")}
          type="date"
          placeholder="Enter date"
          className={`form-control ${errors.date ? "is-invalid" : ""}`}
          autoComplete="off"
        />
        {errors.date && <p className="text-danger">{errors.date.message}</p>}

        <button type="submit" className="btn btn-primary w-100 mt-3">
          Add Task
        </button>
      </form>
    </div>
  );
};

export default AddTask;
