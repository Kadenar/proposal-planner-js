import * as React from "react";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { withStyles } from "@material-ui/styles";
import SettingsIcon from "@mui/icons-material/Settings";

const BoldedTableCell = withStyles((theme) => ({
  root: {
    fontWeight: "bold",
  },
}))(TableCell);

const StyledTableCell = withStyles((theme) => ({
  root: {
    width: "27vw",
  },
}))(TableCell);

export function CollapsibleRow({
  title = "",
  costOfItem = 0,
  costWithItem = 0,
  ccyFormat = () => {},
  breakdown = [],
  configure = () => {},
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            style={{ fontWeight: "bold", color: "black" }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            {title}
          </IconButton>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={configure}
            style={{ fontWeight: "bold", color: "black" }}
          >
            {<SettingsIcon />}
          </IconButton>
        </TableCell>
        <TableCell></TableCell>
        <TableCell align="center">{ccyFormat(costOfItem)}</TableCell>
        <TableCell align="center">{ccyFormat(costWithItem)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <BoldedTableCell>Name</BoldedTableCell>
                    <BoldedTableCell>Qty</BoldedTableCell>
                    <BoldedTableCell>Cost</BoldedTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {breakdown.map((entry) => (
                    <TableRow key={entry.name}>
                      <StyledTableCell>{entry.name}</StyledTableCell>
                      <TableCell>{entry.quantity}</TableCell>
                      <TableCell>{ccyFormat(entry.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
