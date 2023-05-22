import React, {useMemo} from "react";

import { useDispatch, batch } from "react-redux";
import MaterialTable from "material-table";
import { 
    updateCommission, updateFee, updateLaborQuantity, updateMultiplier,
    updateSelectedProposal, updateUnitCostTax, updateLaborCost, addProductToTable, resetProposal
} from "../../reducers/rootReducers";
import jsonData from '../../data/proposals.json';

export default function ListOfExistingProposals() {
    const allProposals = useMemo(() => {
        return JSON.parse(JSON.stringify(jsonData));
    }, []);

    const dispatch = useDispatch();

    // TODO -> Is there a better way of doing this instead of multiple dispatches
    const selectProposal = (value) => {

      // Batch to prevent multiple rerenders
      batch(() => {
        dispatch(updateSelectedProposal(value.name));
        dispatch(updateUnitCostTax(value.data.unitCostTax));
        dispatch(updateCommission(value.data.commission));
        dispatch(updateMultiplier(value.data.multiplier));
        
        // Handle the job table contents
        dispatch(resetProposal());
        value.data.models.forEach(model => {
          dispatch(addProductToTable({
              label: model.name,
              catalogNum: model.catalogNum,
              unitCost: model.unitCost,
              quantity: model.qty,
              totalCost: model.unitCost * model.qty,
          }));
        });
        
        
        const fees = value.data.fees;
        Object.keys(fees).forEach(fee => {
            dispatch(updateFee(fee, fees[fee].qty));
        });

        const labors = value.data.labor;
        Object.keys(labors).forEach(labor => {
            dispatch(updateLaborQuantity(labor, labors[labor].qty));
            dispatch(updateLaborCost(labor, labors[labor].cost));
        });

      });
       
    }
    
    return <MaterialTable
        title={""}
        columns={[
          { title: "Name", field: "name" },
          { title: "Data", field: "data.financing" },
        ]}
        data={allProposals.map((proposal) => {
          return {
            type:
            proposal.name.charAt(0).toUpperCase() +
            proposal.name.slice(1),
            name: proposal.name,
            data: proposal.data
          };
        })}
        actions={[
          {
            icon: "settings",
            tooltip: "Edit product",
            onClick: (event, rowData) => {
              selectProposal(rowData);
            },
          },
          // {
          //   icon: "delete",
          //   tooltip: "Remove product",
          //   onClick: (event, rowData) => {
          //     // Delete this proposal from the json
          //   },
          // },
        ]}
        options={{
          actionsColumnIndex: -1
        }}
      />
}