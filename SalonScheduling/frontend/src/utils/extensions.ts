export const sortRecordByNumericPart = <TValue>(
  record: Record<string, TValue>
) => {
  if (!record || Object.keys(record).length === 0) {
    return record;
  }

  const sortedEntries = Object.entries(record).sort(([keyA], [keyB]) => {
    const numA = Number(keyA.split(":")[0]);
    const numB = Number(keyB.split(":")[0]);
    return numA - numB;
  });

  return Object.fromEntries(sortedEntries);
};

export const weekDays = [
  "1:Segunda",
  "2:Terça",
  "3:Quarta",
  "4:Quinta",
  "5:Sexta",
  "6:Sábado",
  "7:Domingo",
];
