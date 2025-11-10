import AdvocateCard, { Advocate } from "./AdvocateCard";

interface AdvocateListProps {
  advocates: Advocate[];
}

export default function AdvocateList({ advocates }: AdvocateListProps) {
  return (
    <div className="mt-10 flex flex-col gap-6">
      {advocates.map((advocate, index) => (
        <AdvocateCard key={index} advocate={advocate} />
      ))}
    </div>
  );
}

