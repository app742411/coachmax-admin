import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import CategoryManagement from "../../components/coachmax/management/CategoryManagement";
import TermManagement from "../../components/coachmax/management/TermManagement";
import ProgramManagement from "../../components/coachmax/management/ProgramManagement";
import CoachManagement from "../../components/coachmax/management/CoachManagement";

const CoachingManagementPage: React.FC = () => {
  return (
    <>
      <PageMeta title="CoachMax | Coaching Management" description="Manage Categories, Terms, and Programs" />
      <PageBreadcrumb pageTitle="Coaching Management" />

      <div className="space-y-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <CategoryManagement />
          <CoachManagement />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <ProgramManagement />
          <TermManagement />
        </div>
      </div>
    </>
  );
};

export default CoachingManagementPage;
