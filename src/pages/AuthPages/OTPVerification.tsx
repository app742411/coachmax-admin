import React from "react";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import OTPVerificationForm from "../../components/auth/OTPVerifactionForm";

const OTPVerification: React.FC = () => {
    return (
        <>
            <PageMeta
                title="Coach Max | Verify OTP"
                description="Verify your email."
            />
            <AuthLayout>
                <OTPVerificationForm />
            </AuthLayout>
        </>
    );
}

export default OTPVerification;
