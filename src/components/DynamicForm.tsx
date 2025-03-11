import { Controller, useForm } from "react-hook-form";
import { submitForm } from "../api";
import { IFormField, IFormStructure } from "../types/general";

interface Props {
  formStructure: IFormStructure;
}

const DynamicForm = ({ formStructure }: Props) => {
  const { control, handleSubmit, watch } = useForm();
  const watchFields = watch();

  const renderField = (field: IFormField) => {
    if (
      field.id === "securityType" &&
      watchFields["securitySystem"] !== "Yes"
    ) {
      return null;
    }

    return (
      <div key={field.id} className="mb-5">
        <label className="block text-gray-700 font-medium mb-2">
          {field.label}
        </label>
        <Controller
          name={field.id}
          control={control}
          render={({ field: controllerField }) => (
            <>
              {field.type === "text" || field.type === "number" ? (
                <input
                  {...controllerField}
                  type={field.type}
                  className="border border-gray-300 p-3 rounded-md w-full focus:ring-2 focus:ring-blue-500"
                />
              ) : field.type === "select" ? (
                <select
                  {...controllerField}
                  className="border border-gray-300 p-3 rounded-md w-full focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select an option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              ) : null}
            </>
          )}
        />
        {field.fields?.length > 0 && (
          <div className="ml-4 border-l-2 border-gray-300 pl-4 mt-3">
            {field.fields.map((nestedField) => renderField(nestedField))}
          </div>
        )}
      </div>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    try {
      await submitForm(data);
      alert("Form submitted successfully!");
    } catch (error) {
      alert("Failed to submit the form.");
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 bg-gray-50 shadow-md rounded-lg"
    >
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        {formStructure.title}
      </h2>

      {formStructure.fields.map((field) => renderField(field))}

      <button
        type="submit"
        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-md w-full transition"
      >
        Submit
      </button>
    </form>
  );
};

export default DynamicForm;
