"use client";
import CheckboxGroup from "@/components/CheckboxGroup";
import CustomDatePickerRange from "@/components/CustomDatePickerRange"; // CustomDatePickerRange를 가져옵니다
import CustomizedDataGrid from "@/components/CustomizedDataGrid";
import CustomRadioGroup from "@/components/CustomRadioGroup";
import FormGrid from "@/components/FormGrid";
import CustomAutoCompleteCombo from "@/components/CustomAutoCompleteCombo";
import TitleComponent from "@/components/title/TitleComponent";
import {
  Box,
  Button,
  Container,
  FormLabel,
  OutlinedInput,
  Paper,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Dayjs } from "dayjs";
import { useState } from "react";
import { checkboxOptions, radioOptions, top100Films } from "./data";
import SearchBox from "@/components/search/SearchBox";

export default function MyPage() {
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);

  const handleSubmit = (event: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement | undefined;
  }) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // FormData를 JSON 객체로 변환
    const json: { [key: string]: any } = {};

    formData.forEach((value, key) => {
      // 같은 이름으로 여러 값이 있을 경우 배열로 처리
      if (formData.getAll(key).length > 1) {
        json[key] = formData.getAll(key); // 배열로 변환
      } else {
        json[key] = value; // 단일 값
      }
    });
  };

  return (
    <Container maxWidth="xl">
      <TitleComponent title="Page Title" />

      <SearchBox>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <FormGrid size={{ xs: 12, md: 3 }}>
              <FormLabel htmlFor="first-name" required>
                First name
              </FormLabel>
              <OutlinedInput
                id="first-name"
                name="first-name"
                type="text"
                placeholder="John"
                autoComplete="first name"
                required
                fullWidth
              />
            </FormGrid>
            <FormGrid size={{ xs: 12, md: 3 }}>
              <FormLabel htmlFor="last-name" required>
                Last name
              </FormLabel>
              <OutlinedInput
                id="last-name"
                name="last-name"
                type="text"
                placeholder="Doe"
                autoComplete="last name"
                required
                fullWidth
              />
            </FormGrid>
            <FormGrid size={{ xs: 12, md: 3 }}>
              <FormLabel htmlFor="email" required>
                Email
              </FormLabel>
              <OutlinedInput
                id="email"
                name="email"
                type="email"
                placeholder="example@example.com"
                autoComplete="email"
                required
                fullWidth
              />
            </FormGrid>
            <FormGrid size={{ xs: 12, md: 3 }}>
              <FormLabel htmlFor="phone" required>
                Phone
              </FormLabel>
              <OutlinedInput
                id="phone"
                name="phone"
                type="tel"
                placeholder="(123) 456-7890"
                autoComplete="tel"
                required
                fullWidth
              />
            </FormGrid>
            <FormGrid size={{ xs: 12, md: 6 }}>
              <FormLabel htmlFor="checkboxes" required>
                Select Options
              </FormLabel>
              <CheckboxGroup
                options={checkboxOptions}
                selectedOptions={["checkbox1", "checkbox3"]}
                name="checkboxes"
              />
            </FormGrid>
            <FormGrid size={{ xs: 12, md: 6 }}>
              <FormLabel htmlFor="gender" required>
                Gender
              </FormLabel>
              <CustomRadioGroup
                options={radioOptions}
                defaultValue="female"
                name="radiogroup"
              />
            </FormGrid>
            <FormGrid size={{ xs: 12, md: 6 }}>
              <FormLabel htmlFor="date-range" required>
                Date Range
              </FormLabel>
              <CustomDatePickerRange
                fromDate={fromDate}
                toDate={toDate}
                onFromChange={(newValue) => setFromDate(newValue)}
                onToChange={(newValue) => setToDate(newValue)}
                fromName="fromDate" // FormData에서 사용할 이름
                toName="toDate" // FormData에서 사용할 이름
              />
            </FormGrid>
            <FormGrid size={{ xs: 12, md: 6 }}>
              <FormLabel htmlFor="movie-select" required>
                Select Movie
              </FormLabel>
              <CustomAutoCompleteCombo
                name="searchselect"
                options={top100Films}
              />
            </FormGrid>
          </Grid>

          <Grid
            container
            spacing={2}
            sx={{ marginTop: 2, justifyContent: "flex-end" }}
          >
            <FormGrid>
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </FormGrid>
          </Grid>
        </Box>
      </SearchBox>

      <Grid container spacing={2} columns={12}>
        <Grid size={{ md: 12, lg: 12 }}>
          <CustomizedDataGrid />
        </Grid>
      </Grid>
    </Container>
  );
}
