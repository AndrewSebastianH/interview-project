"use client";

import { TextField, Button, Card } from "@mui/material";
import CustomButton from "@/components/ui/CustomButton";
import Image from "next/image";
import React from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
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
              <TextField fullWidth label="Email" type="email" />
            </div>
            <div>
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
              />
            </div>

            <CustomButton href="/">Login</CustomButton>

            <div className="text-gray-400 text-sm text-right pt-3">
              Account is provided by HR.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
