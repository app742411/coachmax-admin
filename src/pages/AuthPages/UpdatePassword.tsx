import React from "react";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import UpdatePasswordForm from "../../components/auth/UpdatePasswordForm";

const UpdatePassword: React.FC = () => {
  return (
    <>
      <PageMeta
        title="Coach Max | Update Password"
        description="Secure your account with a new password."
      />
      <AuthLayout>
        <UpdatePasswordForm />
      </AuthLayout>
    </>
  );
}

export default UpdatePassword;
