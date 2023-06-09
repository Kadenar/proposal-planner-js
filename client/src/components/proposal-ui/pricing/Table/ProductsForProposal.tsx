import { useSelector, useDispatch } from "react-redux";

import { ccyFormat, getQuoteName } from "../pricing-utils";

import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import {
  BoldedItalicsTableCell,
  BoldedTableCell,
  ActionsTableCell,
} from "../../../coreui/StyledComponents";

import { removeProductFromProposal } from "../../../../data-management/store/slices/selectedProposalSlice";
import { ReduxStore } from "../../../../data-management/middleware/Interfaces";

export default function ProductsForProposal() {
  const dispatch = useDispatch();

  const { selectedProposal } = useSelector(
    (state: ReduxStore) => state.selectedProposal
  );
  const products = selectedProposal?.data?.products;

  if (!products) {
    return (
      <>
        Proposal in database possibly corrupted? Products attribute is not
        defined!
      </>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table size={"small"} stickyHeader={true} aria-label="products table">
        <TableHead>
          <TableRow>
            <BoldedItalicsTableCell>Model name</BoldedItalicsTableCell>
            <BoldedItalicsTableCell>Quote option</BoldedItalicsTableCell>
            <BoldedItalicsTableCell>Model #</BoldedItalicsTableCell>
            <BoldedItalicsTableCell>Qty</BoldedItalicsTableCell>
            <BoldedItalicsTableCell>Unit cost</BoldedItalicsTableCell>
            <BoldedItalicsTableCell>Sum</BoldedItalicsTableCell>
            <ActionsTableCell>Actions</ActionsTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.length > 0 ? (
            products.map((product, index) => {
              const { name, modelNum, qty, cost } = product;
              return (
                <TableRow key={name + index}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{getQuoteName(product.quote_option)}</TableCell>
                  <TableCell>{modelNum}</TableCell>
                  <TableCell>{qty}</TableCell>
                  <TableCell>{ccyFormat(cost)}</TableCell>
                  <TableCell>{ccyFormat(qty * cost)}</TableCell>
                  <TableCell>
                    <Tooltip title="Remove product">
                      <IconButton
                        onClick={() =>
                          removeProductFromProposal(dispatch, { index })
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <BoldedTableCell align="center" colSpan={7}>
                No products added yet
              </BoldedTableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
