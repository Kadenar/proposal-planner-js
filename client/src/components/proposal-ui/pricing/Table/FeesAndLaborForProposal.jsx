import { useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  calculateFees,
  calculateLabor,
  returnOnlyValidFees,
  returnOnlyValidLabor,
} from "../pricing-utils";

import { Paper, TableBody, TableContainer, Table } from "@mui/material";

import { CollapsibleRow } from "./CollapsibleRow";

import {
  updateProposalFees,
  updateProposalLabors,
} from "../../../../data-management/store/slices/selectedProposalSlice";
import { feesDialog } from "../../../coreui/dialogs/frontend/FeesDialog";
import { laborsDialog } from "../../../coreui/dialogs/frontend/LaborsDialog";
import { showSnackbar } from "../../../coreui/CustomSnackbar";

export default function FeesAndLaborForProposal() {
  const dispatch = useDispatch();

  const { selectedProposal } = useSelector((state) => state.selectedProposal);
  const { fees } = useSelector((state) => state.fees);
  const { labors } = useSelector((state) => state.labors);

  const proposalFees = selectedProposal.data.fees;
  const proposalLabors = selectedProposal.data.labor;

  // Fetch the current fees stored in the database. Remove any fees no longer available and rename any others.
  const validFees = useMemo(() => {
    return returnOnlyValidFees({ proposalFees, availableFees: fees });
  }, [proposalFees, fees]);

  // Fetch the current labor stored in the database. Remove any labor no longer available and rename any others.

  const validLabor = useMemo(() => {
    return returnOnlyValidLabor({
      proposalLabors,
      availableLabors: labors,
    });
  }, [proposalLabors, labors]);

  // TODO - is there a better way to do this avoiding the need for a useEffect entirely?
  useEffect(() => {
    updateProposalFees(dispatch, { newFees: validFees });
    updateProposalLabors(dispatch, { newLabors: validLabor });

    // We only want to run this a SINGLE time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Used for inner table of labor
  const laborBreakDown = useMemo(() => {
    return Object.keys(proposalLabors).map((type) => {
      return {
        name: proposalLabors[type].name,
        quantity: proposalLabors[type].qty,
        amount: proposalLabors[type].cost,
      };
    });
  }, [proposalLabors]);

  // User for inner table of fees
  const feesBreakDown = useMemo(() => {
    return Object.keys(proposalFees).map((fee) => {
      return {
        name: proposalFees[fee].name,
        quantity: 1,
        amount: proposalFees[fee].cost,
        type: proposalFees[fee].type,
      };
    });
  }, [proposalFees]);

  const costOfFeesTotal = useMemo(() => {
    return calculateFees(proposalFees);
  }, [proposalFees]);

  const costOfLaborTotal = useMemo(() => {
    return calculateLabor(proposalLabors);
  }, [proposalLabors]);

  return (
    <>
      {/* Our second table contains cost breakdown */}
      <TableContainer component={Paper}>
        <Table
          size={"small"}
          stickyHeader={true}
          aria-label="fees and labor table"
        >
          <TableBody>
            {/* Labor */}
            <CollapsibleRow
              title={"Labor"}
              costOfItem={costOfLaborTotal}
              breakdown={laborBreakDown}
              configure={() =>
                laborsDialog({
                  labor: proposalLabors,
                  onSubmit: (labors) => {
                    let error = false;
                    Object.keys(labors).forEach((labor) => {
                      if (labors[labor].cost < 0) {
                        return false;
                      }
                    });

                    if (error) {
                      showSnackbar({
                        title:
                          "Labor costs must be greater than or equal to 0.",
                        show: true,
                        status: "error",
                      });
                      return false;
                    }

                    updateProposalLabors(dispatch, { newLabors: labors });
                    showSnackbar({
                      title: "Successfully updated labor!",
                      show: true,
                      status: "success",
                    });
                    return true;
                  },
                })
              }
            />
            {/* Fees */}
            <CollapsibleRow
              title={"Fees"}
              costOfItem={costOfFeesTotal}
              breakdown={feesBreakDown}
              configure={() =>
                feesDialog({
                  fees: proposalFees,
                  onSubmit: (fees) => {
                    let errors = false;
                    Object.keys(fees).forEach((fee) => {
                      if (fees[fee].cost < 0) {
                        errors = true;
                        return false;
                      }
                    });

                    if (errors) {
                      showSnackbar({
                        title: "Fee costs must be greater than or equal to 0.",
                        show: true,
                        status: "error",
                      });
                      return false;
                    }

                    updateProposalFees(dispatch, { newFees: fees });
                    showSnackbar({
                      title: "Successfully updated fees!",
                      show: true,
                      status: "success",
                    });
                    return true;
                  },
                })
              }
            />
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
