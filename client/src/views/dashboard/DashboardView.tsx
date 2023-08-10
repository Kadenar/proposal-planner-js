import { Box, Card, Collapse, Stack, Typography } from "@mui/material";
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

import { StyledIconButton } from "../../components/StyledComponents";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { SoldJob } from "../../middleware/Interfaces";

interface SalesData {
  numberOfCommissionsReceived: number;
  commissionsReceived: number;
  numberOfCommissionsOutstanding: number;
  commissionsOutstanding: number;
  jobsCompleted: number;
  jobsOutstanding: number;
  totalJobsSold: number;
  numberOfDraftedProposals: number;
  numberOfClients: number;
  jobsSoldByMonth: Array<{ jobs: SoldJob[] }>;
  jobsCompletedByMonth: Array<{ jobs: SoldJob[] }>;
}

const MonthNameLookup = (index: number) => {
  let ret;

  switch (index) {
    case 0:
      ret = "Jan";
      break;
    case 1:
      ret = "Feb";
      break;
    case 2:
      ret = "Mar";
      break;
    case 3:
      ret = "Apr";
      break;
    case 4:
      ret = "May";
      break;
    case 5:
      ret = "Jun";
      break;
    case 6:
      ret = "Jul";
      break;
    case 7:
      ret = "Aug";
      break;
    case 8:
      ret = "Sep";
      break;
    case 9:
      ret = "Oct";
      break;
    case 10:
      ret = "Nov";
      break;
    case 11:
      ret = "Dec";
      break;
    default:
      ret = "";
  }

  return ret;
};

const DashboardView = ({ salesData }: { salesData: SalesData }) => {
  const [statsOpen, setStatsOpen] = useState(true);

  return (
    <Stack ml={2} gap={2}>
      <Card sx={{ padding: 2 }}>
        <StyledIconButton
          aria-label="expand row"
          size="small"
          onClick={() => setStatsOpen(!statsOpen)}
          style={{ fontWeight: "bold", marginBottom: 10 }}
        >
          {statsOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          Statistics
        </StyledIconButton>
        <Collapse
          in={statsOpen}
          timeout="auto"
          unmountOnExit
          sx={{ paddingLeft: 2 }}
        >
          <Stack>
            <Typography sx={{ display: "list-item" }}>
              {`You have drafted ${salesData.numberOfDraftedProposals} proposal(s)`}
            </Typography>
            <Typography sx={{ display: "list-item" }}>
              {`You have ${salesData.numberOfClients} client(s)`}
            </Typography>
            <Typography sx={{ display: "list-item" }}>
              {`You have sold a total of ${salesData.totalJobsSold} job(s)`}
            </Typography>
            <Typography sx={{ display: "list-item" }}>
              {`You have ${salesData.jobsOutstanding} job(s) outstanding`}
            </Typography>
            <Typography sx={{ display: "list-item" }}>
              {`You have ${salesData.jobsCompleted} job(s) completed`}
            </Typography>
          </Stack>
        </Collapse>
      </Card>
      <Card sx={{ padding: 2 }}>
        <Stack direction="row" justifyContent={"center"}>
          <Box justifyContent="center">
            <Typography>Jobs sold by month</Typography>
            <AreaChart
              width={450}
              height={300}
              data={salesData.jobsSoldByMonth.map((job, index) => {
                return {
                  name: MonthNameLookup(index),
                  jobs: job.jobs.length,
                };
              })}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={["dataMin", "dataMax"]} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="jobs"
                stroke="#8884d8"
                fill="#8884d8"
              />
            </AreaChart>
          </Box>

          <Box justifyContent="center">
            <Typography>Jobs completed by month</Typography>
            <AreaChart
              width={450}
              height={300}
              data={salesData.jobsCompletedByMonth.map((job, index) => {
                return {
                  name: MonthNameLookup(index),
                  jobs: job.jobs.length,
                };
              })}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={["dataMin", "dataMax"]} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="jobs"
                stroke="#8884d8"
                fill="#8884d8"
              />
            </AreaChart>
          </Box>
        </Stack>
      </Card>
      <Card sx={{ padding: 2 }}>
        <Stack direction="row" justifyContent={"center"}>
          <Box justifyContent="center">
            <Typography>Commissions received vs. outstanding</Typography>
            <BarChart
              width={450}
              height={300}
              data={[
                {
                  name: "Commissions",
                  received: salesData.numberOfCommissionsReceived,
                  outstanding: salesData.numberOfCommissionsOutstanding,
                },
              ]}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, "dataMax + 2"]} />
              <Tooltip />
              <Bar dataKey="received" fill="#8884d8" />
              <Bar dataKey="outstanding" fill="#82ca9d" />
            </BarChart>
          </Box>
        </Stack>
      </Card>
    </Stack>
  );
};

export default DashboardView;
