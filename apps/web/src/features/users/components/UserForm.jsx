import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ROLES } from "../../../constants/roles";
import { SelectInput, TextInput } from "../../common/forms/FormFields";
import { Button } from "../../common/components/UI";

const schema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  role: yup.string().required(),
});

export default function UserForm({ initialValues, onSubmit, onCancel }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    values: initialValues,
  });
  return (
    <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
      <TextInput label="Name" error={errors.name?.message} {...register("name")} />
      <TextInput label="Email" error={errors.email?.message} {...register("email")} />
      <SelectInput label="Role" options={Object.values(ROLES)} {...register("role")} />
      <div className="flex justify-end gap-2 mt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit">Save User</Button>
      </div>
    </form>
  );
}
