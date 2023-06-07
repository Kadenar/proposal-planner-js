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

export default function ProductsForProposal() {
  const dispatch = useDispatch();

  const { selectedProposal } = useSelector((state) => state.selectedProposal);
  const products = selectedProposal.data.products;

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
              const { name, catalogNum, quantity, unitCost } = product.data;
              return (
                <TableRow key={product.data.name + index}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{getQuoteName(product.quote_option)}</TableCell>
                  <TableCell>{catalogNum}</TableCell>
                  <TableCell>{quantity}</TableCell>
                  <TableCell>{ccyFormat(unitCost)}</TableCell>
                  <TableCell>{ccyFormat(quantity * unitCost)}</TableCell>
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
