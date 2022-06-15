import React, { useState } from "react";

import { Form, Button } from "react-bootstrap";

import DrillForm from "./DrillForm";

import { useRouter } from "next/router";

export default function CategoryForm({
  formId,
  categoryForm,
  newCategory = true,
}) {
  const [form, setForm] = useState({
    _id: categoryForm._id || "",
    title: categoryForm.title || "",
    drills: categoryForm.drills || [],
  });
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (event) => {
    setErrors([]);
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const formValidate = () => {
    let err = [];
    if (!form.title) err.push("Title is required");
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      form,
    });
    const errs = formValidate();
    if (errs.length === 0) {
      postData(form);
    } else {
      setErrors(errs);
    }
  };

  const postData = async (formData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/category", {
        method: newCategory ? "POST" : "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status);
      } else {
        console.log("Category submitted successfully");
      }

      router.push(`/`);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const newDrill = () => {
    setForm({
      ...form,
      drills: [
        ...form.drills,
        {
          id: new Date().getTime().toString(),
          title: "",
          tags: [],
          stars: 0,
          instructions: "",
        },
      ],
    });
  };

  const editDrill = (specificDrill) => {
    try {
      setForm({
        ...form,
        drills: form.drills.map((drill) => {
          if (drill.id === specificDrill.id) {
            return specificDrill;
          }
          return drill;
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {errors.length > 0 && (
        <div className="alert alert-danger">
          {errors.map((err, i) => (
            <p key={i}>{err}</p>
          ))}
        </div>
      )}
      <Form id={formId} onSubmit={handleSubmit}>
        <Form.Group className="mb-2" controlId="blog-title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            disabled={isLoading}
          />
        </Form.Group>

        <Form.Group className="mb-2" controlId="blog-drills">
          <Form.Label>Drills</Form.Label>
          <div>
            {form.drills.map((drill, i) => (
              <DrillForm editDrill={editDrill} key={i} drill={drill} />
            ))}
          </div>
          <div className="">
            <Button variant="success" onClick={newDrill}>
              New Drill
            </Button>
          </div>
        </Form.Group>

        <Form.Group className="mt-5">
          <Button disabled={isLoading} type="submit" variant={"primary"}>
            {newCategory ? "Submit" : "Update"}
          </Button>
        </Form.Group>
      </Form>
    </>
  );
}