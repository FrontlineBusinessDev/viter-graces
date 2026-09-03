// Compares a form's editable row list (line items, contact persons, etc.)
// against its initially-loaded snapshot to decide whether the list has been
// meaningfully changed.
//
// A row appended via an "Add Item"/"Add Contact Person" button starts out as
// an exact copy of `blankTemplate` - that append alone must NOT count as a
// change. Only once the user actually types into one of its fields (or an
// existing row is edited or removed) does the list become dirty.
const strip = (row, ignoreKeys) => {
  const copy = { ...row };
  ignoreKeys.forEach((key) => delete copy[key]);
  return copy;
};

export function isRowsDirty(
  currentRows = [],
  initialRows = [],
  blankTemplate = {},
  ignoreKeys = ["id"],
) {
  // an existing row was removed - that's always a real change
  if (currentRows.length < initialRows.length) {
    return true;
  }

  // rows present since load: flag any actual edit
  for (let i = 0; i < initialRows.length; i++) {
    if (
      JSON.stringify(strip(currentRows[i], ignoreKeys)) !==
      JSON.stringify(strip(initialRows[i], ignoreKeys))
    ) {
      return true;
    }
  }

  // newly appended rows only count once they no longer match the blank
  // template they were created from, i.e. the user filled something in
  for (let i = initialRows.length; i < currentRows.length; i++) {
    if (
      JSON.stringify(strip(currentRows[i], ignoreKeys)) !==
      JSON.stringify(strip(blankTemplate, ignoreKeys))
    ) {
      return true;
    }
  }

  return false;
}
