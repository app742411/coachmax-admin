import React from "react";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import ForgetPasswordForm from "../../components/auth/ForgetPasswordForm";

const ForgetPassword: React.FC = () => {
  return (
    <>
      <PageMeta
        title="Coach Max | Forgot Password"
        description="Reset your password."
      />
      <AuthLayout>
        <ForgetPasswordForm />
      </AuthLayout>
    </>
  );
}

export default ForgetPassword;
