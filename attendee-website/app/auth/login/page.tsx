"use client";

import {
  TextField,
  Button,
  Card,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import CustomButton from "@/components/ui/CustomButton";
import Image from "next/image";
import React from "react";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");

  const [showPassword, setShowPassword] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);

  const handleShowPassword = () => setShowPassword(true);
  const handleHidePassword = () => setShowPassword(false);

  // validations
  const validateEmail = (value: string) => {
    if (!value) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format";
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Minimum 6 characters";
    return "";
  };

  const isFormValid =
    email.length > 0 &&
    password.length > 0 &&
    !validateEmail(email) &&
    !validatePassword(password);

  // handle login
  const handleLogin = async () => {
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    if (emailErr || passErr) {
      setEmailError(emailErr);
      setPasswordError(passErr);
      return;
    }

    setIsLoading(true);
    try {
      router.push("/");
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden md:block md:w-[40%] relative">
        <Image
          src="/login.jpg"
          alt="Login Banner"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="flex w-full md:w-[60%] items-center justify-center bg-gray-100">
        <div className="w-full max-w-sm flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <Image
              src="/logo_dexagroup.png"
              alt="Dexa Group Logo"
              width={200}
              height={80}
              className="mb-4"
            />
            <h1 className="text-2xl text-amber-950 font-semibold">
              Login to your account
            </h1>
          </div>

          {/* Form */}
          <div className="flex flex-col space-y-4">
            <div>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                onBlur={() => setEmailError(validateEmail(email))}
                error={Boolean(emailError)}
                helperText={emailError}
              />
            </div>
            <div>
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                onBlur={() => setPasswordError(validatePassword(password))}
                error={Boolean(passwordError)}
                helperText={passwordError}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Hold to view password">
                          <IconButton
                            aria-label="hold to view password"
                            edge="end"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleShowPassword();
                            }}
                            onMouseUp={handleHidePassword}
                            onMouseLeave={handleHidePassword}
                            onTouchStart={handleShowPassword}
                            onTouchEnd={handleHidePassword}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </div>

            <CustomButton
              onClick={handleLogin}
              loading={isLoading}
              disabled={!isFormValid || isLoading}
            >
              Login
            </CustomButton>

            <div className="text-gray-400 text-sm text-right pt-3">
              Account is provided by HR.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
