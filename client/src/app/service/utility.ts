export const sortObject = (a: any, b: any, field: string, dir: string) => {
  if (a[field] < b[field]) return dir === 'asc' ? 1 : -1;
  if (a[field] > b[field]) return dir === 'desc' ? -1 : 1;
  return 0;
};

export const filterObjects = (item: any, filter: string, names: string[]) => {
  let result = true;
  names.forEach((aName) => {
    if (item[aName].toLowerCase().indexOf(filter.toLowerCase()) === -1)
      result = false;
  });
  return result;
};