import React, { useState } from "react";

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
import SettingsIcon from "@mui/icons-material/Settings";
import {
  BoldedTableCell,
  StyledTableCell,
} from "../../coreui/StyledComponents";

export function CollapsibleRow({
  title = "",
  costOfItem = 0,
  costWithItem = 0,
  ccyFormat = () => {},
  breakdown = [],
  configure = () => {},
}) {
  const [open, setOpen] = useState(false);

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
