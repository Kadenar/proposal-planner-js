import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface SalesData {
  commissionsReceived: number;
  commissionsOutstanding: number;
  jobsCompleted: number;
  jobsOutstanding: number;
  totalJobsSold: number;
}

const DashboardView = ({ salesData }: { salesData: SalesData }) => {
  const commissionsReceived = [
    { name: "Jan", amt: salesData.commissionsReceived },
    { name: "Feb", amt: salesData.commissionsReceived },
    { name: "Mar", amt: salesData.commissionsReceived },
    { name: "Apr", amt: salesData.commissionsReceived },
    { name: "May", amt: salesData.commissionsReceived },
    { name: "Jun", amt: salesData.commissionsReceived },
    { name: "Jul", amt: salesData.commissionsReceived },
    { name: "Aug", amt: salesData.commissionsReceived },
    { name: "Sep", amt: salesData.commissionsReceived },
    { name: "Oct", amt: salesData.commissionsReceived },
    { name: "Nov", amt: salesData.commissionsReceived },
    { name: "Dec", amt: salesData.commissionsReceived },
  ];

  const commissionsOutstanding = [
    { name: "Jan", amt: salesData.commissionsOutstanding },
    { name: "Feb", amt: salesData.commissionsOutstanding },
    { name: "Mar", amt: salesData.commissionsOutstanding },
    { name: "Apr", amt: salesData.commissionsOutstanding },
    { name: "May", amt: salesData.commissionsOutstanding },
    { name: "Jun", amt: salesData.commissionsOutstanding },
    { name: "Jul", amt: salesData.commissionsOutstanding },
    { name: "Aug", amt: salesData.commissionsOutstanding - 100 },
    { name: "Sep", amt: salesData.commissionsOutstanding },
    { name: "Oct", amt: salesData.commissionsOutstanding },
    { name: "Nov", amt: salesData.commissionsOutstanding },
    { name: "Dec", amt: salesData.commissionsOutstanding },
  ];
  return (
    <>
      <AreaChart
        width={900}
        height={400}
        data={commissionsReceived}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="amt" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>

      <AreaChart
        width={900}
        height={400}
        data={commissionsOutstanding}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="amt" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </>
  );
};

export default DashboardView;
