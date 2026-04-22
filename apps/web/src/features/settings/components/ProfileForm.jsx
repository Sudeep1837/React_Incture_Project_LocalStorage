import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextInput } from "../../common/forms/FormFields";
import { Button } from "../../common/components/UI";

const schema = yup.object({
  name: yup.string().required("Display name is required"),
  email: yup.string().email("Must be a valid email").required("Email is required"),
});

export default function ProfileForm({ initialValues, onSubmit }) {
  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: yupResolver(schema),
    values: initialValues, // Updates reactively
  });
  
  return (
    <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
      <TextInput label="Display Name" error={errors.name?.message} {...register("name")} placeholder="Enter your display name" />
      <TextInput label="Email Address" error={errors.email?.message} {...register("email")} placeholder="you@example.com" />
      <div className="flex justify-end mt-2">
        <Button variant="primary" type="submit" disabled={!isDirty || isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </form>
  );
}
