import { TemplateObject } from "./Interfaces.ts";
import {
  runGetRequest,
  runPostRequest,
  simpleDeleteFromDatabase,
} from "./database-actions.ts";
import { fetchFees } from "./feeHelpers.ts";
import { fetchLabors } from "./laborHelpers.ts";

/**
 * Fetch all templates in the database
 * @returns
 */
export async function fetchTemplates(): Promise<TemplateObject[]> {
  return await runGetRequest("templates");
}

/**
 * Add new template to the database
 * @returns
 */
export async function addTemplate(
  name: string,
  description: string,
  existingTemplate?: TemplateObject | null
) {
  if (name === "") {
    return {
      status: 500,
      data: {
        message: "Template name cannot be blank.",
      },
    };
  }

  const existingTemplates = await fetchTemplates();

  let newTemplate = await getNewTemplateItem(name, description);

  if (existingTemplate) {
    newTemplate = {
      ...newTemplate,
      name,
      description,
      data: {
        products: existingTemplate.data.products,
        fees: existingTemplate.data.fees,
        labor: existingTemplate.data.labor,
        unitCostTax: existingTemplate.data.unitCostTax,
        quote_options: existingTemplate.data.quote_options,
      },
    };
  }

  return runPostRequest(existingTemplates.concat(newTemplate), "templates");
}

/**
 * Delete a given template from the database
 * @returns
 */
export async function deleteTemplate(guid: string) {
  return await simpleDeleteFromDatabase(
    fetchTemplates,
    "templates",
    guid,
    "guid"
  );
}

/**
 * Saves a given template
 * @returns
 */
export async function saveTemplate(templateToSave: TemplateObject) {
  const existingTemplates = await fetchTemplates();
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  const index = existingTemplates.findIndex((template) => {
    return template.guid === templateToSave.guid;
  });

  if (index === -1) {
    return {
      status: 500,
      data: { message: "Template could not be found in database." },
    };
  }

  const newTemplates = [...existingTemplates];

  newTemplates[index] = {
    ...newTemplates[index],
    dateModified: `${month}/${day}/${year}`,
    data: {
      ...newTemplates[index].data,
      unitCostTax: templateToSave.data.unitCostTax,
      labor: templateToSave.data.labor,
      fees: templateToSave.data.fees,
      products: templateToSave.data.products,
      quote_options: templateToSave.data.quote_options,
      start_date: templateToSave.data.start_date || "",
      target_quote: templateToSave.data.target_quote,
      target_commission: templateToSave.data.target_commission,
    },
  };

  return await runPostRequest(newTemplates, "templates");
}

/**
 * Helper to return the default json for a new template
 * @returns
 */
const getNewTemplateItem = async (
  name: string,
  description: string
): Promise<TemplateObject> => {
  const date = new Date();
  const dateNow = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;

  const fees = await fetchFees();
  const labors = await fetchLabors();

  return {
    guid: crypto.randomUUID(),
    name,
    description,
    dateCreated: dateNow,
    dateModified: dateNow,
    data: {
      products: [],
      unitCostTax: 8.375,
      labor: labors.map((labor) => {
        return {
          guid: labor.guid,
          cost: labor.cost,
          qty: 0,
        };
      }),
      fees: fees.map((fee) => {
        return {
          guid: fee.guid,
          cost: fee.cost,
        };
      }),
      quote_options: [],
      start_date: "",
    },
  };
};
