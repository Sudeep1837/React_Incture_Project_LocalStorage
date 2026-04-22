import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextInput } from "../../common/forms/FormFields";
import { Button } from "../../common/components/UI";

const schema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup.string().min(8, "Password must be at least 8 characters").required("New password is required"),
});

export default function PasswordForm({ onSubmit }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ 
    resolver: yupResolver(schema) 
  });

  return (
    <form className="grid gap-5" onSubmit={handleSubmit(async (values) => { 
      await onSubmit(values); 
      reset(); 
    })}>
      <TextInput type="password" label="Current Password" error={errors.currentPassword?.message} {...register("currentPassword")} placeholder="••••••••" />
      <TextInput type="password" label="New Password" error={errors.newPassword?.message} {...register("newPassword")} placeholder="••••••••" />
      <div className="flex text-sm text-slate-500 my-1">
        Password must be at least 8 characters long.
      </div>
      <div className="flex justify-end mt-2">
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </form>
  );
}
