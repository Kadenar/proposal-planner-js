import { useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { returnOnlyValidFees, returnOnlyValidLabor } from "../pricing-utils";

import { Paper, TableBody, TableContainer, Table } from "@mui/material";

import { CollapsibleRow } from "./CollapsibleRow";

import {
  updateProposalFees,
  updateProposalLabors,
} from "../../../../data-management/store/slices/selectedProposalSlice";
import { feesDialog } from "../../../coreui/dialogs/frontend/FeesDialog";
import { laborsDialog } from "../../../coreui/dialogs/frontend/LaborsDialog";
import { showSnackbar } from "../../../coreui/CustomSnackbar";
import {
  PsuedoObjectOfLabor,
  ReduxStore,
} from "../../../../data-management/middleware/Interfaces";

export default function FeesAndLaborForProposal() {
  const dispatch = useDispatch();

  const { selectedProposal } = useSelector(
    (state: ReduxStore) => state.selectedProposal
  );
  const { fees } = useSelector((state: ReduxStore) => state.fees);
  const { labors } = useSelector((state: ReduxStore) => state.labors);

  const proposalFees = selectedProposal?.data.fees;
  const proposalLabors = selectedProposal?.data.labor;

  // Fetch the current fees stored in the database. Remove any fees no longer available and rename any others.
  const validFees = useMemo(() => {
    if (!proposalFees) {
      return {};
    }
    return returnOnlyValidFees(proposalFees, fees);
  }, [proposalFees, fees]);

  // Fetch the current labor stored in the database. Remove any labor no longer available and rename any others.
  const validLabor = useMemo(() => {
    if (!proposalLabors) {
      return {};
    }

    return returnOnlyValidLabor(proposalLabors, labors);
  }, [proposalLabors, labors]);

  // TODO - is there a better way to do this avoiding the need for a useEffect entirely?
  useEffect(() => {
    updateProposalFees(dispatch, validFees);
    updateProposalLabors(dispatch, validLabor);

    // We only want to run this a SINGLE time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Used for inner table of labor
  const laborBreakDown = useMemo(() => {
    if (!proposalLabors) {
      return [];
    }

    return Object.keys(proposalLabors).map((type) => {
      return {
        name: proposalLabors[type].name,
        qty: proposalLabors[type].qty,
        amount: proposalLabors[type].cost,
      };
    });
  }, [proposalLabors]);

  // User for inner table of fees
  const feesBreakDown = useMemo(() => {
    if (!proposalFees) {
      return [];
    }

    return Object.keys(proposalFees).map((fee) => {
      return {
        name: proposalFees[fee].name,
        qty: 1,
        amount: proposalFees[fee].cost,
        type: proposalFees[fee].type,
      };
    });
  }, [proposalFees]);

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
              breakdown={laborBreakDown}
              configure={() =>
                laborsDialog({
                  labor: proposalLabors,
                  onSubmit: async (labors: PsuedoObjectOfLabor | undefined) => {
                    if (!labors) {
                      showSnackbar({
                        title:
                          "There were not available labors? - Something went wrong.",
                        show: true,
                        status: "error",
                      });
                      return false;
                    }

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

                    updateProposalLabors(dispatch, labors);
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
              breakdown={feesBreakDown}
              configure={() =>
                feesDialog({
                  fees: proposalFees,
                  onSubmit: async (fees) => {
                    if (!fees) {
                      showSnackbar({
                        title: "Something went wrong.",
                        show: true,
                        status: "error",
                      });
                      return false;
                    }

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

                    updateProposalFees(dispatch, fees);
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
