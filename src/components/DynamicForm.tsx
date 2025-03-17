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

  const childFields: IFormField[] = formStructure.fields.flatMap(
    (field) => field.fields || []
  );

  // Extract unique dependencies
  const dependencies = Array.from(
    new Set(
      childFields
        .map((field) => field.dynamicOptions?.dependsOn)
        .filter((dep): dep is string => Boolean(dep))
    )
  );

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
      dependencies.forEach((dep) => {
        const watchValue = watch(dep);

        if (watchValue) {
          const dependentFields = childFields.filter((f) => f.id === dep);

          dependentFields.forEach((field) =>
            getDynamicOptions(
              childFields.filter(
                (chf) => chf.dynamicOptions?.dependsOn === field.id
              )[0],
              watchValue
            )
          );
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    dependencies.map((dep) => watch(dep))
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
            <label className="block text-gray-800 dark:text-gray-200 font-medium mb-2">
              {field.label}
            </label>
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
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
              )}
            />
            {errors[field.id] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[field.id]?.message as string}
              </p>
            )}
          </div>
        );

      case "select":
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-gray-800 dark:text-gray-200 font-medium mb-2">
              {field.label}
            </label>
            <Controller
              name={field.id}
              control={control}
              rules={{
                required: field.required ? `${field.label} is required` : false,
              }}
              render={({ field: controllerField }) => (
                <select
                  {...controllerField}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  onChange={(e) => {
                    controllerField.onChange(e.target.value);
                    if (field.dynamicOptions) {
                      setValue(field.id, e.target.value);
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
              )}
            />
            {errors[field.id] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[field.id]?.message as string}
              </p>
            )}
          </div>
        );

      case "radio":
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-gray-800 dark:text-gray-200 font-medium mb-2">
              {field.label}
            </label>
            <Controller
              name={field.id}
              control={control}
              rules={{
                required: field.required ? `${field.label} is required` : false,
              }}
              render={({ field: controllerField }) => (
                <div className="flex flex-wrap gap-4">
                  {field.options?.map((option) => (
                    <label
                      key={option}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        {...controllerField}
                        value={option}
                        checked={controllerField.value === option}
                        onChange={() => controllerField.onChange(option)}
                        className="h-4 w-4 text-blue-500 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            />
            {errors[field.id] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[field.id]?.message as string}
              </p>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-gray-800 dark:text-gray-200 font-medium mb-2">
              {field.label}
            </label>
            <Controller
              name={field.id}
              control={control}
              rules={{
                required: field.required ? `${field.label} is required` : false,
              }}
              render={({ field: controllerField }) => (
                <div className="flex flex-wrap gap-4">
                  {field.options?.map((option) => (
                    <label
                      key={option}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        {...controllerField}
                        className="h-4 w-4 text-blue-500 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            />
            {errors[field.id] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[field.id]?.message as string}
              </p>
            )}
          </div>
        );

      case "group":
        return (
          <fieldset
            key={field.id}
            className="border border-gray-300 dark:border-gray-600 p-4 mb-4 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800"
          >
            <legend className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {field.label}
            </legend>
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
      className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 max-w-lg mx-auto border border-gray-200 dark:border-gray-700"
    >
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">
        {formStructure.title}
      </h2>
      <div className="space-y-4">
        {formStructure.fields.map((field) =>
          field.type === "group" ? (
            <div
              key={field.id}
              className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800"
            >
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                {field.label}
              </h3>
              <div className="space-y-4">{field.fields?.map(renderField)}</div>
            </div>
          ) : (
            renderField(field)
          )
        )}
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 mt-4"
      >
        Submit
      </button>
    </form>
  );
};

export default DynamicForm;
