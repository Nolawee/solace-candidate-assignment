"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Advocate } from "./components/AdvocateCard";
import Search from "./components/Search";
import AdvocateList from "./components/AdvocateList";
import Navbar from "./components/ui/navbar";

const STATUS_CODES = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error"
}

const DEGREE_FILTERS = [
  { label: "MD", value: "MD" },
  { label: "PhD", value: "PhD" },
  { label: "MSW", value: "MSW" },
];

const EXPERIENCE_SORT_OPTIONS = [
  { label: "Experience ↑", value: "asc" },
  { label: "Experience ↓", value: "desc" },
];

const DEFAULT_SORT = EXPERIENCE_SORT_OPTIONS[0].value;

const areArraysEqual = (first: string[], second: string[]) => {
  if (first.length !== second.length) {
    return false;
  }

  const firstSorted = [...first].sort();
  const secondSorted = [...second].sort();

  return firstSorted.every((value, index) => value === secondSorted[index]);
};

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [status, setStatus] = useState(STATUS_CODES.LOADING); // loading | success | error
  const [error, setError] = useState(null);
  const [degreeFilters, setDegreeFilters] = useState<string[]>([]);
  const [experienceSort, setExperienceSort] = useState<string>(DEFAULT_SORT);

  // Initialize search term from URL on mount
  useEffect(() => {
    const qParam = searchParams.get("q") ?? "";
    const degreeParams = searchParams
      .getAll("degree")
      .filter((degree) =>
        DEGREE_FILTERS.some((option) => option.value === degree)
      );
    const sortParam = searchParams.get("sort");
    const nextSort =
      sortParam === "asc" || sortParam === "desc" ? sortParam : DEFAULT_SORT;

    setSearchTerm((prev) => (prev === qParam ? prev : qParam));

    setDegreeFilters((prev) =>
      areArraysEqual(prev, degreeParams) ? prev : degreeParams
    );

    setExperienceSort((prev) => (prev === nextSort ? prev : nextSort));
  }, [searchParams]);

  // Fetch advocates from API with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("fetching advocates...");
      setStatus(STATUS_CODES.LOADING);

      // Build the API URL with query parameter if search term exists
      const params = new URLSearchParams();
      if (searchTerm) {
        params.set("q", searchTerm);
      }
      degreeFilters.forEach((degree) => {
        params.append("degree", degree);
      });
      if (experienceSort && experienceSort !== DEFAULT_SORT) {
        params.set("sort", experienceSort);
      }

      const queryString = params.toString();
      const url = queryString ? `/api/advocates?${queryString}` : "/api/advocates";

      fetch(url)
        .then((response) => response.json())
        .then((jsonResponse) => {
          setAdvocates(jsonResponse.data);
          setStatus(STATUS_CODES.SUCCESS);
        })
        .catch((error) => {
          setError(error.message || String(error));
          setStatus(STATUS_CODES.ERROR);
        });

      // Update URL with search term and filters
      const nextPath = queryString ? `?${queryString}` : "/";
      router.push(nextPath);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, degreeFilters, experienceSort, router]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const onReset = () => {
    setSearchTerm("");
    setDegreeFilters([]);
    setExperienceSort(DEFAULT_SORT);
  };

  const canReset =
    searchTerm.trim().length > 0 ||
    degreeFilters.length > 0 ||
    experienceSort !== DEFAULT_SORT;

  return (
    <main className="mt-6 py-3 rounded-xl bg-[#fffdfa]">
      <Navbar />
      <div className="mx-auto w-[90vw] space-y-6">
        <Search 
          searchTerm={searchTerm}
          onChange={onChange}
          onReset={onReset}
          resultsCount={advocates.length}
          selectedFilters={degreeFilters}
          onFilterChange={(degree) => {
            setDegreeFilters((prev) =>
              prev.includes(degree)
                ? prev.filter((item) => item !== degree)
                : [...prev, degree]
            );
          }}
          filterOptions={DEGREE_FILTERS}
          selectedSort={experienceSort}
          onSortChange={setExperienceSort}
          sortOptions={EXPERIENCE_SORT_OPTIONS}
          canReset={canReset}
        />
        {status === STATUS_CODES.LOADING && <div className="text-sm text-gray-500">Loading...</div>}
        {status === STATUS_CODES.ERROR && <div className="text-sm text-red-500">{error}</div>}
        {status === STATUS_CODES.SUCCESS &&  <AdvocateList advocates={advocates} />}
      </div>
    </main>
  );
}
