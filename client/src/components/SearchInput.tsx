import {
  FunctionComponent,
  useState,
  ChangeEvent,
  useMemo,
  useRef,
  useEffect,
} from "react";

import {
  FormControl,
  IconButton,
  InputAdornment,
  List,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import DraftsIcon from "@mui/icons-material/Drafts";
import DescriptionIcon from "@mui/icons-material/Description";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import HeatPumpIcon from "@mui/icons-material/HeatPump";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import HotTubIcon from "@mui/icons-material/HotTub";
import OilBarrelIcon from "@mui/icons-material/OilBarrel";
import PowerIcon from "@mui/icons-material/Power";

import {
  StyledSearch,
  StyledSearchHeader,
  StyledSearchItem,
} from "./StyledComponents";
import { useAppDispatch, useAppSelector } from "../services/store";
import { updateActiveClient } from "../services/slices/clientsSlice";
import { selectProposal } from "../services/slices/activeProposalSlice";
import { productDialog } from "./dialogs/backend/ProductDialog";
import { editProduct } from "../services/slices/productsSlice";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";

const TypeSearch: FunctionComponent = () => {
  const [searchText, setSearchText] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const debouncedSearch = useRef(
    debounce(async (value) => {
      if (value === "") {
        setShowSearchResults(false);
      } else {
        setShowSearchResults(true);
      }
    }, 300)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

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
              debouncedSearch(event.target.value);
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
              zIndex: 10000,
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
  category: string;
};

const SearchResults = ({
  value,
  callBack,
}: {
  value: string;
  callBack: () => void;
}) => {
  const dispatch = useAppDispatch();
  const { templates } = useAppSelector((state) => state.templates);
  const { proposals } = useAppSelector((state) => state.proposals);
  const { clients } = useAppSelector((state) => state.clients);
  const { products } = useAppSelector((state) => state.products);
  const { filters } = useAppSelector((state) => state.filters);
  const navigate = useNavigate();

  const searchResults = useMemo<SearchResult[]>(() => {
    let allResults: SearchResult[] = [];

    // Add proposals to search results
    templates.forEach((template) => {
      if (
        template.name.toLowerCase().includes(value.toLowerCase()) ||
        template.description.toLowerCase().includes(value.toLowerCase())
      ) {
        allResults.push({
          icon: <DraftsIcon />,
          name: template.name,
          category: "Templates",
          action: () => {
            navigate("/templates");
            selectProposal(dispatch, template);
            callBack();
          },
        });
      }
    });

    // Add proposals to search results
    proposals.forEach((proposal) => {
      if (
        proposal.name.toLowerCase().includes(value.toLowerCase()) ||
        proposal.description.toLowerCase().includes(value.toLowerCase())
      ) {
        allResults.push({
          icon: <DescriptionIcon />,
          name: proposal.name,
          category: "Proposals",
          action: () => {
            navigate("/proposals");
            selectProposal(dispatch, proposal);
            callBack();
          },
        });
      }
    });

    // Add clients to search results
    clients.forEach((client) => {
      if (client.name.toLowerCase().includes(value.toLowerCase())) {
        allResults.push({
          icon: <PeopleAltIcon />,
          name: client.name,
          category: "Clients",
          action: () => {
            navigate("/clients");
            updateActiveClient(dispatch, client);
            callBack();
          },
        });
      }
    });

    // Add products to search results
    Object.keys(products).forEach((category) => {
      products[category].forEach((product) => {
        if (
          product.model.toLowerCase().includes(value.toLowerCase()) ||
          product.description.toLowerCase().includes(value.toLowerCase()) ||
          product.modelNum.toLowerCase().includes(value.toLowerCase())
        ) {
          const categorySanitized = category.replaceAll("_", " ") || " ";
          const categoryLabel =
            categorySanitized.charAt(0).toUpperCase() +
            categorySanitized.slice(1);

          let icon;

          if (category === "furnaces" || category === "boilers") {
            icon = <LocalFireDepartmentIcon />;
          } else if (
            category === "mini_splits" ||
            category === "air_handlers" ||
            category === "condensers" ||
            category === "coils"
          ) {
            icon = <AcUnitIcon />;
          } else if (category === "heat_pumps") {
            icon = <HeatPumpIcon />;
          } else if (
            category === "water_heaters" ||
            category === "aqua_boosters"
          ) {
            icon = <HotTubIcon />;
          } else if (category === "oil_tanks") {
            icon = <OilBarrelIcon />;
          } else if (category === "generators") {
            icon = <PowerIcon />;
          } else {
            icon = <ShoppingCartIcon />;
          }

          allResults.push({
            icon,
            category: categoryLabel,
            name: product.model,
            action: () => {
              callBack();
              productDialog({
                header: "Edit product",
                filters: filters,
                filter: {
                  guid: category,
                  label: categoryLabel,
                },
                modelName: product.model,
                modelNum: product.modelNum,
                description: product.description,
                cost: product.cost,
                onSubmit: async (
                  filter,
                  modelName,
                  modelNum,
                  description,
                  cost
                ) => {
                  return editProduct(dispatch, {
                    guid: product.guid,
                    existing_filter_guid: category,
                    new_filter_guid: filter?.guid,
                    modelName,
                    modelNum,
                    description,
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

    return allResults;
  }, [
    value,
    products,
    clients,
    proposals,
    filters,
    templates,
    dispatch,
    callBack,
    navigate,
  ]);

  const renderContent = () => {
    let prevCategory = "";
    return searchResults.length > 0 ? (
      searchResults.map((result, index) => {
        let contentToRender;

        if (prevCategory !== result.category) {
          contentToRender = (
            <div key={index}>
              <StyledSearchHeader>
                <Typography>{result.category}</Typography>
              </StyledSearchHeader>
              <StyledSearchItem onClick={result.action}>
                <>{result.icon}</>
                <>{result.name}</>
              </StyledSearchItem>
            </div>
          );
        } else {
          contentToRender = (
            <StyledSearchItem key={index} onClick={result.action}>
              <>{result.icon}</>
              <>{result.name}</>
            </StyledSearchItem>
          );
        }
        prevCategory = result.category;

        return contentToRender;
      })
    ) : (
      <StyledSearchItem sx={{ justifyContent: "center" }}>
        No results found
      </StyledSearchItem>
    );
  };

  return <>{renderContent()}</>;
};

export default TypeSearch;
