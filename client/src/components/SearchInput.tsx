import {
  FunctionComponent,
  useState,
  useEffect,
  KeyboardEvent,
  ChangeEvent,
} from "react";

import {
  FormControl,
  IconButton,
  InputAdornment,
  List,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { StyledSearch, StyledSearchItem } from "./StyledComponents";
import { useAppDispatch, useAppSelector } from "../services/store";
import { updateActiveClient } from "../services/slices/clientsSlice";
import { selectProposal } from "../services/slices/activeProposalSlice";
import { productDialog } from "./dialogs/backend/ProductDialog";
import { editProduct } from "../services/slices/productsSlice";
import { useNavigate } from "react-router-dom";

const TypeSearch: FunctionComponent = () => {
  const [searchText, setSearchText] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  return (
    <>
      <FormControl sx={{ margin: 0 }}>
        <StyledSearch
          autoComplete="off"
          size="small"
          value={searchText}
          onChange={(event: ChangeEvent<HTMLInputElement>): void => {
            setSearchText(event.target.value);

            if (event.target.value === "") {
              setShowSearchResults(false);
            } else {
              setShowSearchResults(true);
            }
          }}
          placeholder="Search for something"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Tooltip title="Search">
                  <IconButton
                    onClick={() => {
                      if (searchText !== "") {
                        setShowSearchResults(true);
                      }
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment
                position="end"
                sx={{ visibility: searchText === "" ? "hidden" : "show" }}
              >
                <Tooltip title="Clear">
                  <IconButton
                    onClick={() => {
                      setSearchText("");
                      setShowSearchResults(false);
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
        {showSearchResults && (
          <List
            sx={{
              position: "absolute",
              top: 35,
              zIndex: 1000,
              maxHeight: "50vh",
              minWidth: "400px",
              overflowY: "auto",
            }}
          >
            <SearchResults
              value={searchText}
              callBack={() => {
                setShowSearchResults(false);
                setSearchText("");
              }}
            />
          </List>
        )}
      </FormControl>
    </>
  );
};

type SearchResult = {
  icon: any;
  name: string;
  action: () => void;
};

const SearchResults = ({
  value,
  callBack,
}: {
  value: string;
  callBack: () => void;
}) => {
  const [data, setData] = useState<SearchResult[]>([]);
  const dispatch = useAppDispatch();
  const { proposals } = useAppSelector((state) => state.proposals);
  const { clients } = useAppSelector((state) => state.clients);
  const { products } = useAppSelector((state) => state.products);
  const { filters } = useAppSelector((state) => state.filters);
  const navigate = useNavigate();

  useEffect(() => {
    let allResults: SearchResult[] = [];
    proposals.forEach((proposal) => {
      if (
        proposal.name.toLowerCase().includes(value.toLowerCase()) ||
        proposal.description.toLowerCase().includes(value.toLowerCase())
      ) {
        allResults.push({
          icon: <DescriptionIcon />,
          name: proposal.name,
          action: () => {
            navigate("/proposals");
            selectProposal(dispatch, proposal);
            callBack();
          },
        });
      }
    });

    clients.forEach((client) => {
      if (client.name.toLowerCase().includes(value.toLowerCase())) {
        allResults.push({
          icon: <PersonIcon />,
          name: client.name,
          action: () => {
            navigate("/clients");
            updateActiveClient(dispatch, client);
            callBack();
          },
        });
      }
    });

    Object.keys(products).forEach((category) => {
      products[category].forEach((product) => {
        if (product.model.toLowerCase().includes(value.toLowerCase())) {
          const categorySanitized = category.replaceAll("_", " ") || " ";
          allResults.push({
            icon: <ShoppingCartIcon />,
            name: product.model,

            action: () => {
              callBack();
              productDialog({
                header: "Edit product",
                guid: product.guid,
                filters: filters,
                filter: {
                  guid: category,
                  label:
                    categorySanitized.charAt(0).toUpperCase() +
                    categorySanitized.slice(1),
                },
                modelName: product.model,
                modelNum: product.modelNum,
                cost: product.cost,
                onSubmit: async (filter, modelName, modelNum, cost) => {
                  return editProduct(dispatch, {
                    guid: product.guid,
                    filter_guid: filter?.guid,
                    modelName,
                    modelNum,
                    cost,
                    image: undefined,
                  });
                },
              });
            },
          });
        }
      });
    });

    setData(allResults);
  }, [
    value,
    products,
    clients,
    proposals,
    filters,
    dispatch,
    callBack,
    navigate,
  ]);

  return (
    <>
      {data.length > 0 ? (
        data.map((result, index) => {
          return (
            <StyledSearchItem key={index} onClick={result.action}>
              <>{result.icon}</>
              <>{result.name}</>
            </StyledSearchItem>
          );
        })
      ) : (
        <StyledSearchItem sx={{ justifyContent: "center" }}>
          No results found
        </StyledSearchItem>
      )}
    </>
  );
};

export default TypeSearch;
