import { useEffect, useState } from "react";
import { fetchFormStructure, submitForm } from "../api";
import DynamicForm from "../components/DynamicForm";
import { IForm } from "../types/general";

const ApplyForm = () => {
  const [formStructures, setFormStructures] = useState<IForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<IForm | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getForms = async () => {
      try {
        const data = await fetchFormStructure();
        setFormStructures(data);
        if (data.length > 0) {
          setSelectedForm(data[0]);
        }
      } catch (error) {
        console.error("Failed to load forms:", error);
      } finally {
        setLoading(false);
      }
    };

    getForms();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    try {
      const response = await submitForm(data);
      console.log("Form submitted successfully:", response);
    } catch (error) {
      console.error("Form submission failed:", error);
    }
  };

  console.log("form structures", formStructures);

  if (loading)
    return <p className="text-center text-gray-600">Loading forms...</p>;
  if (formStructures.length === 0)
    return <p className="text-center text-gray-600">No forms available</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Apply for Insurance
      </h1>

      {/* Dropdown Selector */}
      <select
        className="border border-gray-300 p-3 rounded-md mb-6 w-full text-gray-700 focus:ring-2 focus:ring-blue-500"
        onChange={(e) => {
          const selected = formStructures.find(
            (form) => form.formId === e.target.value
          );
          setSelectedForm(selected || null);
        }}
        value={selectedForm?.formId || ""}
      >
        {formStructures.map((form) => (
          <option key={form.formId} value={form.formId}>
            {form.title}
          </option>
        ))}
      </select>

      {selectedForm && (
        <DynamicForm formStructure={selectedForm} onSubmit={onSubmit} />
      )}
    </div>
  );
};

export default ApplyForm;
