export function compareBy<T extends object>(key: keyof T) {
  return (studentA: T, studentB: T) => {
    const valueA = studentA[key];
    const valueB = studentB[key];

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return valueA.localeCompare(valueB);
    }
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return valueA - valueB;
    }
    if (valueA instanceof Date && valueB instanceof Date) {
      return valueA.getTime() - valueB.getTime();
    }
    if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
      return Number(valueA) - Number(valueB);
    }

    return 0;
  };
}
