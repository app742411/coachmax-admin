import PageMeta from "../../components/common/PageMeta";
import AddTempPlayerscomp from "../../components/CoachManagement/AddTempPlayerscomp";

export default function AddTempPlayers() {
  return (
    <>
      <PageMeta
        title="CoachMax | Add Temporary Player"
        description="Add temporary player to the system"
      />
      <div className="space-y-6">
        <AddTempPlayerscomp />
      </div>
    </>
  );
}
