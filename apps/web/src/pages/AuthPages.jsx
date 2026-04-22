import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { loginThunk, signupThunk } from "../store/authSlice";

const schema = yup.object({
  name: yup.string(),
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});

export function LoginPage() {
  return <AuthForm mode="login" />;
}

export function SignupPage() {
  return <AuthForm mode="signup" />;
}

function AuthForm({ mode }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  if (token) return <Navigate to="/dashboard" replace />;

  const submit = async (values) => {
    if (mode === "signup") await dispatch(signupThunk(values));
    else await dispatch(loginThunk(values));
    navigate("/dashboard");
  };
  const authInputClass =
    "auth-input w-full rounded-lg border border-slate-300 bg-white/95 px-3 py-2 text-slate-900 caret-indigo-600 placeholder:text-slate-500 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-700";

  return (
    <div className="relative grid min-h-[calc(100vh-120px)] place-items-center overflow-hidden px-6 py-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.2),_transparent_45%),radial-gradient(circle_at_80%_20%,_rgba(6,182,212,0.18),_transparent_40%)]" />
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-2">
        <motion.aside initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-white backdrop-blur-xl">
          <p className="text-cyan-300">Enterprise Work Management</p>
          <h2 className="mt-2 text-3xl font-semibold">Plan smarter. Execute faster. Report confidently.</h2>
          <p className="mt-3 text-slate-300">Designed for modern delivery teams with realtime updates, role-aware visibility, and high-performance workflows.</p>
          <div className="mt-6 space-y-2 text-sm text-slate-200">
            <p>• Projects, tasks, and Kanban orchestration</p>
            <p>• Realtime team collaboration signals</p>
            <p>• Analytics and execution clarity</p>
          </div>
          <div className="mt-8 rounded-xl border border-cyan-300/20 bg-cyan-400/10 p-4 text-sm">
            Demo: `admin@demo.com / Admin@123`
          </div>
        </motion.aside>
        <motion.form initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/10 bg-white/90 p-8 shadow-2xl backdrop-blur" onSubmit={handleSubmit(submit)}>
          <h2 className="text-2xl font-semibold text-slate-900">{mode === "login" ? "Welcome back" : "Create your account"}</h2>
          <p className="mt-1 text-sm text-slate-600">{mode === "login" ? "Sign in to continue to your workspace." : "Start with a collaborative workspace in minutes."}</p>
          <div className="mt-5 space-y-3">
            {mode === "signup" && <input className={authInputClass} placeholder="Full name" {...register("name")} />}
            <input className={authInputClass} placeholder="Email" {...register("email")} />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            <input type="password" className={authInputClass} placeholder="Password" {...register("password")} />
            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
          </div>
          <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }} className="mt-6 w-full rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 py-2 font-medium text-white" type="submit">
            {mode === "login" ? "Login" : "Create account"}
          </motion.button>
          <Link className="mt-4 block text-center text-sm text-indigo-700" to={mode === "login" ? "/signup" : "/login"}>
            {mode === "login" ? "Need an account? Sign up" : "Already have an account? Login"}
          </Link>
        </motion.form>
      </div>
    </div>
  );
}
