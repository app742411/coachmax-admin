
import Label from "../form/Label";
import Badge from "../ui/badge/Badge";

// Inline StarIcon
const StarIcon = ({ fill = "none", size = 16, className = "" }: { fill?: string; size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const DetailItem = ({ label, value, isBadge, isStars, color = "success" }: { label: string; value?: string; isBadge?: boolean; isStars?: boolean; color?: string }) => (
  <div className="flex flex-col gap-1.5">
    <Label className="text-[10px] font-bold text-gray-400 block">{label}</Label>
    {isBadge ? (
      <Badge size="sm" color={color as any} variant="light" className="font-bold text-[10px] px-4 py-1.5 w-fit border border-current min-w-[100px] justify-center">
        {value}
      </Badge>
    ) : isStars ? (
      <div className="flex gap-1 mt-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <StarIcon key={s} fill={s <= (Number(value) || 0) ? "#D02030" : "none"} size={18} className={s <= (Number(value) || 0) ? "text-brand-700" : "text-gray-200 dark:text-gray-800"} />
        ))}
      </div>
    ) : (
      <p className="text-sm font-bold text-gray-800 dark:text-white/90 tracking-tight">{value || "NOT SPECIFIED"}</p>
    )}
  </div>
);

export default DetailItem;
