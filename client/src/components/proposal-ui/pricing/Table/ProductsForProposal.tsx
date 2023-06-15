import { useAppDispatch, useAppSelector } from "../../../../services/store";

import { ccyFormat, getQuoteName } from "../../../../lib/pricing-utils";

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
} from "../../../StyledComponents";

import { removeProductFromProposal } from "../../../../services/slices/activeProposalSlice";

export default function ProductsForProposal() {
  const dispatch = useAppDispatch();

  const { activeProposal } = useAppSelector((state) => state.activeProposal);

  if (!activeProposal) {
    return <>Cannot view products when no proposal is selected!</>;
  }

  const proposalProducts = activeProposal.data.products;

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
          {proposalProducts.length > 0 ? (
            proposalProducts.map((product, index) => {
              const { model, modelNum, qty, cost } = product;
              return (
                <TableRow key={model + index}>
                  <TableCell>{model}</TableCell>
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
