import { createColumnHelper } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { usePersonStore } from "@/store/personStore";
import IndeterminateCheckbox from "./IndeterminateCheckBox";

// Define the `Person` type
export type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

// Default data for the table
export const defaultData: any[] = [
  {
    firstName: "tanner",
    lastName: "linsley",
    age: 24,
    visits: 100,
    status: "In Relationship",
    progress: 50,
  },
  {
    firstName: "tandy",
    lastName: "miller",
    age: 40,
    visits: 40,
    status: "Single",
    progress: 80,
  },
  {
    firstName: "joe",
    lastName: "dirte",
    age: 45,
    visits: 20,
    status: "Complicated",
    progress: 10,
  },
  {
    firstName: "joe",
    lastName: "dirte",
    age: 45,
    visits: 20,
    status: "Complicated",
    progress: 10,
  },
  {
    firstName: "joe",
    lastName: "dirte",
    age: 45,
    visits: 20,
    status: "Complicated",
    progress: 10,
  },
  {
    firstName: "joe",
    lastName: "dirte",
    age: 45,
    visits: 20,
    status: "Complicated",
    progress: 10,
  },
];

// New React component for FirstName cell
const FirstNameCell: React.FC<{ value: string; row: any }> = ({
  value,
  row,
}) => {
  const router = useRouter();
  const setPerson = usePersonStore((state) => state.setPerson);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault(); // Prevent the default anchor tag behavior
    setPerson(row.original); // zustand 상태에 person 저장
    router.push(`/person/${value}`); // URL 이동
  };

  return (
    <a href="#" onClick={handleClick}>
      {value}
    </a>
  );
};

const columnHelper = createColumnHelper<any>();

export const columns = [
  columnHelper.accessor("firstName", {
    cell: (info) => <FirstNameCell value={info.getValue()} row={info.row} />,
    header: "First Name",
    footer: (info) => info.column.id,
    enableResizing: true,
    meta: {
      filterVariant: "text", // 텍스트 필터 추가
    },
    size: 150,
  }),
  columnHelper.accessor("lastName", {
    cell: (info) => <i>{info.getValue()}</i>,
    header: "Last Name",
    footer: (info) => info.column.id,
    enableResizing: true,
    meta: {
      filterVariant: "text", // 텍스트 필터 추가
    },
    size: 150,
  }),
  columnHelper.accessor("age", {
    header: "Age",
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
    enableResizing: true,
    meta: {
      filterVariant: "range", // min-max 필터 추가
    },
    size: 150,
  }),
  columnHelper.accessor("visits", {
    header: "Visits",
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
    enableResizing: true,
    meta: {
      filterVariant: "range", // min-max 필터 추가
    },
    size: 400,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
    enableResizing: true,
    meta: {
      filterVariant: "select", // 선택 필터 추가
    },
    size: 150,
  }),
  columnHelper.accessor("progress", {
    header: "Profile Progress",
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
    enableResizing: true,
    meta: {
      filterVariant: "range", // min-max 필터 추가
    },
    size: 150,
  }),
];
