/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { fetchDynamicOptions } from "../api";
import { IForm, IFormField } from "../types/general";

interface DynamicFormProps {
  formStructure: IForm;
  onSubmit: (data: any) => void;
}

const DynamicForm = ({ formStructure, onSubmit }: DynamicFormProps) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm();

  const [dynamicOptions, setDynamicOptions] = useState<
    Record<string, Record<string, string[]>>
  >({});

  const childFields: IFormField[] = [];
  formStructure.fields.forEach((field) => {
    field.fields?.forEach((childField) => {
      childFields.push(childField);
    });
  });

  // Watch fields that have dependent dynamic options
  useEffect(
    () => {
      const getDynamicOptions = async (field: IFormField, value: string) => {
        const res = await fetchDynamicOptions(field, value);
        setDynamicOptions((prev) => ({
          ...prev,
          [field.id]: res,
        }));
      };
      //dependencies
      childFields.forEach((field: IFormField) => {
        if (field.dynamicOptions) {
          const watchValue = watch(field.dynamicOptions.dependsOn);
          if (watchValue) {
            getDynamicOptions(field, watchValue);
          }
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    childFields.map((field) => watch(field.dynamicOptions?.dependsOn || ""))
  );

  // Function to check if a field should be visible
  const isFieldVisible = (field: IFormField) => {
    if (!field.visibility) return true;
    const { dependsOn, condition, value } = field.visibility;
    const watchedValue = watch(dependsOn);
    return condition === "equals" ? watchedValue === value : true;
  };

  // Function to render input fields
  const renderField = (field: IFormField) => {
    if (!isFieldVisible(field)) return null;

    switch (field.type) {
      case "text":
      case "number":
      case "date":
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-gray-700">{field.label}</label>
            <Controller
              name={field.id}
              control={control}
              rules={{
                required: field.required ? `${field.label} is required` : false,
                ...(field.validation?.min !== undefined && {
                  min: field.validation.min,
                }),
                ...(field.validation?.max !== undefined && {
                  max: field.validation.max,
                }),
                ...(field.validation?.pattern && {
                  pattern: new RegExp(field.validation.pattern),
                }),
              }}
              render={({ field: controllerField }) => (
                <input
                  type={field.type}
                  {...controllerField}
                  className="w-full border rounded px-3 py-2"
                />
              )}
            />
            {errors[field.id] && (
              <p className="text-red-500">
                {errors[field.id]?.message as string}
              </p>
            )}
          </div>
        );

      case "select":
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-gray-700">{field.label}</label>
            <Controller
              name={field.id}
              control={control}
              rules={{
                required: field.required ? `${field.label} is required` : false,
              }}
              render={({ field: controllerField }) => {
                return (
                  <select
                    {...controllerField}
                    className="w-full border rounded px-3 py-2"
                    onChange={(e) => {
                      controllerField.onChange(e.target.value);
                      if (field.dynamicOptions) {
                        fetchDynamicOptions(field, e.target.value);
                        setValue(field.id, ""); // Reset dependent field
                      }
                    }}
                  >
                    <option value="">Select {field.label}</option>
                    {(
                      dynamicOptions[field.id]?.[field.id + "s"] ||
                      field.options ||
                      []
                    ).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                );
              }}
            />
            {errors[field.id] && (
              <p className="text-red-500">
                {errors[field.id]?.message as string}
              </p>
            )}
          </div>
        );

      case "radio":
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-gray-700">{field.label}</label>
            <Controller
              name={field.id}
              control={control}
              rules={{
                required: field.required ? `${field.label} is required` : false,
              }}
              render={({ field: controllerField }) => (
                <div className="flex gap-4">
                  {field.options?.map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                      <input type="radio" {...controllerField} />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
            />
            {errors[field.id] && (
              <p className="text-red-500">
                {errors[field.id]?.message as string}
              </p>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-gray-700">{field.label}</label>
            <Controller
              name={field.id}
              control={control}
              rules={{
                required: field.required ? `${field.label} is required` : false,
              }}
              render={({ field: controllerField }) => (
                <div className="flex gap-4">
                  {field.options?.map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                      <input type="checkbox" {...controllerField} />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
            />
            {errors[field.id] && (
              <p className="text-red-500">
                {errors[field.id]?.message as string}
              </p>
            )}
          </div>
        );

      case "group":
        return (
          <fieldset key={field.id} className="border p-4 mb-4 rounded">
            <legend className="text-lg font-semibold">{field.label}</legend>
            {field.fields?.map((nestedField) => renderField(nestedField))}
          </fieldset>
        );

      default:
        return null;
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 border rounded shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4">{formStructure.title}</h2>
      {formStructure.fields.map((section) => (
        <div key={section.id}>
          <h3 className="text-xl font-semibold mb-2">{section.label}</h3>
          {section.fields?.map((field) => renderField(field))}
        </div>
      ))}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </form>
  );
};

export default DynamicForm;
