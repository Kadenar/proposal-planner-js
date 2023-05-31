import { create } from "zustand";

export const useProductDialogStore = create((set) => ({
  header: "",
  onSubmit: undefined,
  selectedFilter: "",
  modelName: "",
  catalogNum: "",
  unitCost: "",
  updateSelectedFilter: (filter) => set(() => ({ filter: filter })),
  updateModelName: (modelName) => set(() => ({ modelName: modelName })),
  updateCatalogNum: (catalogNum) => set(() => ({ catalogNum: catalogNum })),
  updateUnitCost: (unitCost) => set(() => ({ unitCost: unitCost })),
  close: () => set({ onSubmit: undefined }),
}));
