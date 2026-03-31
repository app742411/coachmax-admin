import {
 Table,
 TableBody,
 TableCell,
 TableHeader,
 TableRow
} from "../ui/table";

interface TeamEntry {
 rank: number;
 name: string;
 played: number;
 points: number;
 form: ("W" | "D" | "L")[];
}

const standings: TeamEntry[] = [
 { rank: 1, name: "CoachMax Lions", played: 12, points: 31, form: ["W", "W", "D", "W", "W"] },
 { rank: 2, name: "West Coast FC", played: 12, points: 28, form: ["W", "L", "W", "W", "D"] },
 { rank: 3, name: "City Raiders", played: 11, points: 24, form: ["D", "W", "W", "L", "W"] },
 { rank: 4, name: "Ocean View Acad.", played: 12, points: 22, form: ["L", "D", "W", "D", "W"] },
 { rank: 5, name: "Central Tigers", played: 12, points: 19, form: ["W", "L", "L", "W", "D"] },
];

export default function LeagueStandings() {
 return (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-sm h-full">
   <div className="flex items-center justify-between mb-6">
    <div>
     <h3 className="text-lg font-bold text-gray-800 dark:text-white/90 ">
      League Standings
     </h3>
     <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400 font-medium">
      U-18 Elite Championship
     </p>
    </div>
    <button className="text-brand-500 font-bold text-xs hover:underline decoration-2 underline-offset-4">Full Table</button>
   </div>

   <div className="overflow-x-auto">
    <Table>
     <TableHeader className="border-b border-gray-100 dark:border-gray-800">
      <TableRow>
       <TableCell isHeader className="py-3 px-2 text-[10px] font-bold text-gray-400">Pos</TableCell>
       <TableCell isHeader className="py-3 text-[10px] font-bold text-gray-400">Team</TableCell>
       <TableCell isHeader className="py-3 text-[10px] font-bold text-gray-400 text-center">P</TableCell>
       <TableCell isHeader className="py-3 text-[10px] font-bold text-gray-400 text-center">Pts</TableCell>
       <TableCell isHeader className="py-3 text-[10px] font-bold text-gray-400">Form</TableCell>
      </TableRow>
     </TableHeader>
     <TableBody className="divide-y divide-gray-50 dark:divide-gray-800/50">
      {standings.map((team) => (
       <TableRow key={team.rank} className="group hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
        <TableCell className="py-4 px-2 font-bold text-gray-400 group-hover:text-brand-500">{team.rank}</TableCell>
        <TableCell className="py-4 font-bold text-gray-900 dark:text-gray-100">{team.name}</TableCell>
        <TableCell className="py-4 text-center font-bold text-gray-500">{team.played}</TableCell>
        <TableCell className="py-4 text-center font-bold text-brand-600">{team.points}</TableCell>
        <TableCell className="py-4">
         <div className="flex gap-1">
          {team.form.map((res, i) => (
           <span key={i} className={`w-5 h-5 flex items-center justify-center rounded text-[9px] font-bold text-white ${res === "W" ? "bg-green-500" : res === "D" ? "bg-gray-400" : "bg-red-500"
            }`}>
            {res}
           </span>
          ))}
         </div>
        </TableCell>
       </TableRow>
      ))}
     </TableBody>
    </Table>
   </div>
  </div>
 );
}
