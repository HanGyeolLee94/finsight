export const formDataToJson = (formData: FormData): { [key: string]: any } => {
  const json: { [key: string]: any } = {};

  formData.forEach((value, key) => {
    if (formData.getAll(key).length > 1) {
      json[key] = formData.getAll(key); // 여러 개의 값이 있으면 배열로 변환
    } else {
      try {
        // Check if value is a JSON string and parse it
        const parsedValue = JSON.parse(value as string);
        json[key] = Array.isArray(parsedValue) ? parsedValue : parsedValue; // If it's a JSON array, store it as an array
      } catch (e) {
        // If parsing fails, treat as a plain string
        json[key] = value;
      }
    }
  });

  return json;
};

export const getTableChanges = (tableRef: any) => {
  if (!tableRef.current) return null;

  // Validate the table before processing changes
  if (!tableRef.current.validateTable()) {
    return null; // Return null to prevent further processing
  }

  const addedRows = tableRef.current.getAddedRows();
  const deletedRows = tableRef.current.getDeletedRows();
  const modifiedRows = tableRef.current.getModifiedRows();

  if (
    addedRows.length === 0 &&
    deletedRows.length === 0 &&
    modifiedRows.length === 0
  ) {
    return null; // Return null if there are no changes
  }

  return {
    add: addedRows.map((row: any) => ({ ...row })),
    delete: deletedRows.map((row: any) => ({ ...row })),
    update: modifiedRows.map((row: any) => ({ ...row })),
  };
};
