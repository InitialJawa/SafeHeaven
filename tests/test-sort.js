const list = [98.0, 92.6, 83.5, 83.4, 81.3, 80.0, 75.9, 34.6, 35.4, 41.5, 41.7, 45.5, 45.8, 49.4];
const sortOrder = 'desc';
list.sort((a, b) => {
  let valA = a;
  let valB = b;

  if (typeof valA === 'string') {
    valA = valA.toLowerCase();
    valB = valB.toLowerCase();
  }

  if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
  if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
  
  return 0;
});
console.log(list);
