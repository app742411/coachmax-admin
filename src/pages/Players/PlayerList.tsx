
import PageMeta from "../../components/common/PageMeta";
import PlayerListComp from "../../components/PlayerComponents/PlayerListComp";

export default function PlayerList() {
 return (
  <>
   <PageMeta
    title="Coch Max Dashboard"
    description="Coch Max Admin Dashboard"
   />
   <div className=" gap-4 md:gap-6">
    <PlayerListComp />
   </div>
  </>
 );
}
